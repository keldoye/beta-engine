import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
	IsEnum,
	IsOptional,
	IsString,
	MaxLength,
	MinLength
} from 'class-validator';
import { BaseVOResponseDTO } from 'src/data/base-vo/base-vo.dto';
import { PersonTitle } from 'src/modules/contact/person/person-titles.enum';
import { ContactResponseDTO, CreateContactDTO } from '../contact.dtos';

export abstract class CreatePersonDTO extends CreateContactDTO {
	@ApiProperty({
		description: 'The title of the person',
		enum: PersonTitle,
		required: false
	})
	@IsOptional()
	@IsEnum(PersonTitle, {
		message: `Invalid title. Valid titles are: ${Object.values(PersonTitle).join(', ')}.`
	})
	title?: PersonTitle;

	@ApiProperty({
		description: 'The first name of the person',
		example: 'John',
		minLength: 1,
		maxLength: 255
	})
	@IsString()
	@MinLength(1, {
		message: 'First name must be at least 1 character long'
	})
	@MaxLength(255, {
		message: 'First name must be less than 255 characters long'
	})
	firstName: string;

	@ApiProperty({
		description: 'The last name of the customer',
		example: 'Doe',
		minLength: 1,
		maxLength: 255
	})
	@IsString()
	@MinLength(1, {
		message: 'Last name must be at least 1 character long'
	})
	@MaxLength(255, {
		message: 'Last name must be less than 255 characters long'
	})
	lastName: string;

	@Expose()
	@ApiProperty({
		description: "The person's date of birth.",
		example: '2026-03-15T14:45:00Z',
		required: false
	})
	@IsOptional()
	dateOfBirth?: Date;
}

export abstract class PersonResponseDTO extends ContactResponseDTO {
	@Expose()
	@ApiProperty({
		description: 'The title of the customer',
		enum: PersonTitle,
		required: false
	})
	title?: PersonTitle;

	@Expose()
	@ApiProperty({
		description: 'The first name of the customer',
		example: 'John'
	})
	firstName: string;

	@Expose()
	@ApiProperty({
		description: 'The last name of the customer',
		example: 'Doe'
	})
	lastName: string;

	@Expose()
	@ApiProperty({
		description: "The person's date of birth.",
		example: '2024-03-15T14:45:00Z'
	})
	dateOfBirth?: Date;
}
