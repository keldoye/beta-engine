import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class SignInDTO {
	@ApiProperty()
	@IsEmail()
	primaryEmail: string;

	@ApiProperty()
	@IsString()
	@MinLength(2)
	@MaxLength(32)
	password: string;
}

export class AuthToken {
	constructor(access_token) {
		this.access_token = access_token;
	}

	@ApiProperty()
	access_token: string;
}
