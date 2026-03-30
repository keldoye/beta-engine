import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { CreatePersonDTO, PersonResponseDTO } from '../person-dtos';
import { Role } from '../person-roles.enum';

export class CreateUserDTO extends CreatePersonDTO {
	@ApiProperty({ enum: Role, description: "User's role." })
	@IsEnum(Role)
	@IsNotEmpty()
	role: Role;

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
	role: Role;
}
