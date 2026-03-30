import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
	IsEmail,
	IsEnum,
	IsOptional,
	IsPhoneNumber,
	IsString,
	MaxLength,
	MinLength
} from 'class-validator';
import { BaseVOResponseDTO } from 'src/data/base-vo/base-vo.dto';
import { PersonTitle } from 'src/modules/persons/titles.enum';

export abstract class CreatePersonDTO {
	@ApiProperty({
		description: 'The title of the customer',
		enum: PersonTitle,
		required: false
	})
	@IsOptional()
	@IsEnum(PersonTitle, {
		message: `Invalid title. Valid titles are: ${Object.values(PersonTitle).join(', ')}`
	})
	title?: PersonTitle;

	@ApiProperty({
		description: 'The first name of the customer',
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

	@ApiProperty({
		description: 'The email address of the customer',
		example: 'john.doe@example.com'
	})
	@IsEmail()
	@MaxLength(255, {
		message: 'Email must be less than 255 characters long'
	})
	email: string;

	@ApiProperty({
		description: 'The phone number of the customer',
		example: '5145160012',
		required: false
	})
	@IsString()
	@IsOptional()
	@MaxLength(255, {
		message: 'Phone must be less than 255 characters long'
	})
	@IsPhoneNumber('CA', {
		message: 'Invalid Canadian phone number'
	})
	phone?: string;

	@Expose()
	@ApiProperty({
		description: "The person's date of birth.",
		example: '2024-03-15T14:45:00Z',
		required: false
	})
	@IsOptional()
	dateOfBirth?: Date;
}

export abstract class PersonResponseDTO extends BaseVOResponseDTO {
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
		description: 'The email address of the customer',
		example: 'john.doe@example.com'
	})
	email: string;

	@Expose()
	@ApiProperty({
		description: 'The phone number of the customer',
		required: false
	})
	phone?: string;

	@Expose()
	@ApiProperty({
		description: "The person's date of birth.",
		example: '2024-03-15T14:45:00Z'
	})
	dateOfBirth?: Date;
}
