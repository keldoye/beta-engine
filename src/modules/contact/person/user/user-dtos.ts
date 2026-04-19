import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { CreatePersonDTO, PersonResponseDTO } from '../person-dtos';
import { PermissionLevel } from './user-roles.enum';

export class CreateUserDTO extends CreatePersonDTO {
	@ApiProperty({ enum: PermissionLevel, description: "User's role." })
	@IsEnum(PermissionLevel, {message : `Invalid permission level. Valid permission levels are : ${Object.values(PermissionLevel).join(', ')}.`})
	@IsNotEmpty()
	permissionLevel: PermissionLevel;

	@ApiProperty({ description: "User's role." })
	@IsString()
	@MinLength(8)
	password: string;
}

export class UpdateUserDTO extends PartialType(CreateUserDTO) {}

export class UserResponseDTO extends PersonResponseDTO {
	@Exclude()
	password: string;

	@ApiProperty()
	@Expose()
	role: PermissionLevel;
}
