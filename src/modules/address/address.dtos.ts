import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { IsNotEmpty } from 'class-validator';
import { Province } from './address.constants';
import { BaseVOResponseDTO } from '../../data/base-vo/base-vo.dto';
import { Expose, Type } from 'class-transformer';
import { CustomerResponseDTO } from '../persons/customer/customer-dtos';

export class CreateAddressDTO {
	@ApiProperty({
		description: 'The street number'
	})
	@IsString()
	@IsNotEmpty()
	streetNumber: string;

	@ApiProperty({
		description: 'The apt number'
	})
	@IsOptional()
	@IsString()
	aptNumber: string;

	@ApiProperty({
		description: 'The street name'
	})
	@IsString()
	@IsNotEmpty()
	streetName: string;

	@ApiProperty({
		description: 'The city'
	})
	@IsString()
	@IsNotEmpty()
	city: string;

	@ApiProperty({
		enum: Province,
		description: 'The province'
	})
	@IsEnum(Province)
	@IsNotEmpty()
	province: Province;
}

export class UpdateAddressDTO extends PartialType(CreateAddressDTO) {}

@Expose()
export class AddressResponseDTO extends BaseVOResponseDTO {
	@Expose()
	@ApiProperty({
		description: 'The street number'
	})
	@IsString()
	@IsNotEmpty()
	streetNumber: string;

	@Expose()
	@ApiProperty({
		description: 'The apt number'
	})
	@IsString()
	aptNumber: string;

	@Expose()
	@ApiProperty({
		description: 'The street name'
	})
	@IsString()
	@IsNotEmpty()
	streetName: string;

	@Expose()
	@ApiProperty({
		description: 'The city'
	})
	@IsString()
	@IsNotEmpty()
	city: string;

	@Expose()
	@ApiProperty({
		enum: Province,
		description: 'The province'
	})
	@IsEnum(Province)
	@IsNotEmpty()
	province: Province;

	@Expose()
	@ApiProperty({
		description: 'The customer this address belongs to',
		type: () => CustomerResponseDTO
	})
	@Type(() => CustomerResponseDTO) // handles circular dependency
	customer: CustomerResponseDTO;
}
