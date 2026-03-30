import {
	Injectable,
	Logger,
	NotFoundException,
	OnModuleInit
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { BaseVOService } from 'src/data/base-vo/base-vo.service';
import { Role } from 'src/modules/persons/person-roles.enum';
import { Not, Repository } from 'typeorm';
import { UserConstants as C } from './user.constants';
import { User } from './user.entity';

@Injectable()
export class UserService implements OnModuleInit {
	private voService: BaseVOService;

	constructor(
		@InjectRepository(User)
		private repository: Repository<User>
	) {
		this.voService = BaseVOService.getInstance();
	}

	async onModuleInit() {
		const superUserExists = await this.isSuperUserCreated();

		if (!superUserExists) {
			Logger.warn('SU account not found. Creating ...');
			const superUser = {
				firstName: C.SU_FIRSTNAME,
				lastName: C.SU_LASTNAME,
				email: C.SU_USERNAME,
				password: C.SU_PASSWORD,
				role: Role.SU
			};
			await this.create(superUser as User, C.SU_SELF);
			Logger.log(`SU account created with password : ${superUser.password}`);
		}
	}

	private isSuperUserCreated = async (): Promise<boolean> => {
		return (await this.repository.count({ where: { role: Role.SU } })) >= 1;
	};

	create = async (user: User, createByUserId: string): Promise<User> => {
		this.voService.handleBaseVOCreation(user, createByUserId);
		user.password = await bcrypt.hash(user.password, C.SALT_ROUNDS);
		return await this.repository.save(user);
	};

	findAll = async (): Promise<User[]> => {
		return await this.repository.find({
			where: { email: Not(C.SU_USERNAME) }
		});
	};

	findOneByEmailOrId = async (
		emailOrId: string,
		shouldSearchByEmail?: boolean
	): Promise<User | null> => {
		const whereClause = shouldSearchByEmail
			? { email: emailOrId }
			: { id: emailOrId };

		const user = await this.repository.findOne({ where: whereClause });

		if (!user) {
			throw new NotFoundException(
				`No user found for ${shouldSearchByEmail ? 'email' : 'id'} ${emailOrId}.`
			);
		}

		return user;
	};

	updateById = async (
		id: string,
		user: User,
		updatedByUserId: string
	): Promise<User | null> => {
		this.voService.handleBaseVOUpdate(user, updatedByUserId);
		await this.repository.update(id, user);

		return this.findOneByEmailOrId(id);
	};

	deleteById = async (id: string): Promise<User | null> => {
		const user = this.findOneByEmailOrId(id);
		await this.repository.delete(id);

		return user;
	};
}
