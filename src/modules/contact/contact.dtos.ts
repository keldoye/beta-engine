import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsPhoneNumber, IsString, MaxLength } from "class-validator";
import { BaseVOResponseDTO } from "src/data/base-vo/base-vo.dto";
import { ContactSubtype } from './contactsubtype.enum';

export abstract class CreateContactDTO {
    @ApiProperty({
		description: 'The email address of the contact',
		example: 'john.doe@example.com'
	})
	@IsEmail()
	@MaxLength(255, {
		message: 'Email must be less than 255 characters long'
	})
	primaryEmail: string;

	@ApiProperty({
		description: 'The phone number of the contact',
		example: '+1-514-555-1234',
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
	primaryPhone: string;
}

export abstract class ContactResponseDTO extends BaseVOResponseDTO {
    @ApiProperty({
        description: "Type of the contact.",
        example: "Person, Organization"
    })
    contactSubtype : ContactSubtype

    @ApiProperty({
		description: 'The email address of the customer',
		example: 'john.doe@example.com'
	})
	primaryEmail: string;

	@ApiProperty({
		description: 'The phone number of the customer',
		example: '2015551234',
		required: false
	})
	@IsString()
	@IsOptional()
	primaryPhone: string;
}