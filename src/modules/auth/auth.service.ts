import {
	Injectable,
	Logger,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common';
import { UserService } from '../persons/user/user.service';
import * as bcrypt from 'bcrypt';
import { SignInDTO, AuthToken } from './auth.dtos';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
	constructor(
		private userService: UserService,
		private jwtService: JwtService
	) { }

	signIn = async (signInDTO: SignInDTO): Promise<AuthToken | undefined> => {
		try {
			const user = await this.userService.findOneByEmailOrId(
				signInDTO.email,
				true
			);

			if (
				!user ||
				!(await bcrypt.compare(signInDTO.password, user?.password))
			) {
				throw new UnauthorizedException(
					`Wrong username and password combination.`
				);
			} else {
				return new AuthToken(
					await this.jwtService.signAsync({
						sub: user.id,
						role: user.role,
						firstName: user.firstName,
						lastName: user.lastName,
						email: user.email,
						username: user.email
					})
				);
			}
		} catch (e) {
			if (e instanceof NotFoundException) {
				throw e;
			} else {
				Logger.log(e);
				throw e;
			}
		}
	};
}
