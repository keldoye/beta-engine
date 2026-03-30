import {
	Body,
	Controller,
	Delete,
	Get,
	NotFoundException,
	Param,
	Post,
	Put,
	Request
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { CreateUserDTO, UpdateUserDTO, UserResponseDTO } from './user-dtos';
import { UserConstants as C } from './user.constants';
import { User } from './user.entity';
import { UserService } from './user.service';

@ApiTags(C.USER_API_TAG)
@ApiBearerAuth(C.ACCESS_TOKEN_TYPE)
@Controller(C.USER_PREFIX)
export class UserController {
	constructor(private userService: UserService) {}

	@Get()
	async getAllUsers(): Promise<UserResponseDTO[]> {
		const users = await this.userService.findAll();
		const usersDTO = users.map((user) =>
			plainToInstance(UserResponseDTO, user)
		);
		return usersDTO;
	}

	@Get(`:${C.ID}`)
	async getUserByid(@Param(C.ID) id: string) {
		const user = await this.userService.findOneByEmailOrId(id);

		return plainToInstance(UserResponseDTO, user);
	}

	@Get(`:${C.EMAIL}`)
	async getUserByEmail(@Param(C.EMAIL) email: string) {
		return this.userService.findOneByEmailOrId(email, true);
	}

	@Put(`:${C.ID}`)
	async updateUserById(
		@Request() request,
		@Param(C.ID) id: string,
		@Body() updateUserDTO: UpdateUserDTO
	) {
		const user = await this.userService.findOneByEmailOrId(id);

		if (user) {
			//TODO: Authorization with @Request
			const requestUser = request.user;
			Object.assign(user, updateUserDTO);
			//Uses sub as part of the JWT Standard : https://auth0.com/docs/secure/tokens/json-web-tokens/json-web-token-claims
			await this.userService.updateById(id, user, requestUser.sub);

			return plainToInstance(UserResponseDTO, user);
		} else {
			throw new NotFoundException(`No user with ID: ${id}`);
		}
	}

	@Post()
	async createUser(
		@Body() createUserDTO: CreateUserDTO,
		@Request() request
	): Promise<UserResponseDTO> {
		const user = plainToInstance(User, createUserDTO);
		await this.userService.create(user, request.user.sub);

		return plainToInstance(UserResponseDTO, user);
	}

	@Delete(`:${C.ID}`)
	async deleteUser(@Param(C.ID) id: string) {
		const user = await this.userService.findOneByEmailOrId(id);
		await this.userService.deleteById(id);

		return plainToInstance(UserResponseDTO, user);
	}
}
