import {
	Body,
	Controller,
	Delete,
	Get,
	NotFoundException,
	Param,
	Post,
	Put,
	Request,
	UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { CreateUserDTO, UpdateUserDTO, UserResponseDTO } from './user-dtos';
import { UserConstants as Constants } from './user.constants';
import { User } from './user.entity';
import { UserService } from './user.service';
import { ResourceOwnerGuard } from 'src/common/guards/resource/resource-owner.guard';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { AllowedPermissionLevel } from 'src/common/guards/roles/decorators/roles.decorator';
import { PermissionLevel } from './user-roles.enum';
import { BaseVOService } from 'src/data/base-vo/base-vo.service';

@UseGuards(RolesGuard, ResourceOwnerGuard)
@ApiTags(Constants.USER_API_TAG)
@ApiBearerAuth(Constants.ACCESS_TOKEN_TYPE)
@Controller(Constants.USER_API_PREFIX)
export class UserController extends BaseVOService {
	constructor(private userService: UserService) {
		super();
	}

	//TODO: change permission level to controller-access classes and include more roles in each.
	@AllowedPermissionLevel(PermissionLevel.ADMIN, PermissionLevel.SU)
	@Get()
	async getAllUsers(): Promise<UserResponseDTO[]> {
		const users = await this.userService.findAll();
		const usersDTO = users.map((user) =>
			plainToInstance(UserResponseDTO, user)
		);
		return usersDTO;
	}

	@Get(`:${Constants.ID}`)
	async getUserByid(@Param(Constants.ID) id: string) {
		const user = await this.userService.findOneByEmailOrId(id);

		return plainToInstance(UserResponseDTO, user);
	}

	@Put(`:${Constants.ID}`)
	async updateUserById(
		@Request() req,
		@Param(Constants.ID) id: string,
		@Body() updateUserDTO: UpdateUserDTO
	) {
		const user = await this.userService.findOneByEmailOrId(id);

		if (user) {
			const requestUser = req.user;
			Object.assign(user, updateUserDTO);
			//Uses sub as part of the JWT Standard : https://auth0.com/docs/secure/tokens/json-web-tokens/json-web-token-claims
			await this.userService.updateById(id, user, requestUser.sub);

			return plainToInstance(UserResponseDTO, user);
		} else {
			throw new NotFoundException(`No user with ID: ${id}`);
		}
	}

	@AllowedPermissionLevel(PermissionLevel.SU, PermissionLevel.ADMIN)
	@Post()
	async createUser(
		@Body() createUserDTO: CreateUserDTO,
		@Request() request
	): Promise<UserResponseDTO> {
		const user = plainToInstance(User, createUserDTO);
		await this.userService.create(user, request.user.sub);

		return plainToInstance(UserResponseDTO, user);
	}

	@Delete(`:${Constants.ID}`)
	async deleteUser(@Param(Constants.ID) id: string) {
		const user = await this.userService.findOneByEmailOrId(id);
		await this.userService.deleteById(id);

		return plainToInstance(UserResponseDTO, user);
	}
}
