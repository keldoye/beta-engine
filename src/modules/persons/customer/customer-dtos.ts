import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import {
	IsBoolean,
	IsEmail,
	IsOptional,
	IsPhoneNumber,
	IsString,
	MaxLength,
	ValidateNested
} from 'class-validator';
import { CreatePersonDTO, PersonResponseDTO } from '../person-dtos';
import {
	AddressResponseDTO,
	CreateAddressDTO
} from 'src/modules/address/address.dtos';

export class CreateCustomerDTO extends CreatePersonDTO {
	@ApiProperty({
		description: 'The company name of the customer',
		required: false
	})
	@IsString()
	@IsOptional()
	@MaxLength(255, {
		message: 'Company name must be less than 255 characters long'
	})
	companyName?: string;

	@ApiProperty({
		description: 'The address(es) of the customer',
		required: false,
		type: [CreateAddressDTO]
	})
	@ValidateNested()
	addresses?: CreateAddressDTO[];
}

export class UpdateCustomerDTO extends PartialType(CreateCustomerDTO) { }

@Exclude()
export class CustomerResponseDTO extends PersonResponseDTO {
	@Expose()
	@ApiProperty({
		description: 'The company name of the customer',
		example: 'Acme Inc.',
		required: false
	})
	companyName?: string;

	@Expose()
	@ApiProperty({
		description: 'Whether the customer is active',
		example: true
	})
	isActive: boolean;

	@Expose()
	@ApiProperty({
		description: 'The address(es) of the customer',
		required: false,
		type: [AddressResponseDTO]
	})
	@Type(() => AddressResponseDTO)
	@ValidateNested({ each: true })
	addresses?: AddressResponseDTO[];
}

export class CustomerFiltersDTO {
	@ApiProperty({
		description: 'The email of the customer',
		required: false,
		example: 'john.doe@example.com'
	})
	@IsString()
	@IsOptional()
	@IsEmail()
	email?: string;

	@ApiProperty({
		description: 'The first name of the customer',
		required: false,
		example: 'John'
	})
	@IsString()
	@IsOptional()
	@MaxLength(255, {
		message: 'First name must be less than 255 characters long'
	})
	firstName?: string;

	@ApiProperty({
		description: 'The last name of the customer',
		required: false,
		example: 'Doe'
	})
	@IsString()
	@IsOptional()
	@MaxLength(255, {
		message: 'Last name must be less than 255 characters long'
	})
	lastName?: string;

	@ApiProperty({
		description: 'The phone of the customer',
		required: false,
		example: '5145160012'
	})
	@IsString()
	@IsOptional()
	@IsPhoneNumber('CA', {
		message: 'Invalid Canadian phone number'
	})
	phone?: string;

	@ApiProperty({
		description: 'The company name of the customer',
		required: false,
		example: 'Example Inc.'
	})
	@IsString()
	@IsOptional()
	@MaxLength(255, {
		message: 'Company name must be less than 255 characters long'
	})
	companyName?: string;

	@ApiProperty({
		description: 'Whether the customer is active',
		required: false,
		example: true
	})
	@IsBoolean()
	@IsOptional()
	isActive?: boolean;

	@ApiProperty({
		description: 'The search term',
		required: false,
		example: 'Example'
	})
	@IsString()
	@IsOptional()
	@MaxLength(255, {
		message: 'Search must be less than 255 characters long'
	})
	search?: string;
}