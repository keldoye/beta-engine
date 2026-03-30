import {
	Body,
	Controller,
	Get,
	NotFoundException,
	Post,
	Put,
	Request
} from '@nestjs/common';
import {
	ApiBearerAuth,
	ApiOperation,
	ApiResponse,
	ApiTags
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { UUIDParam } from 'src/common/decorators/uuid-param.decorator';
import { CustomerService } from '../persons/customer/customer.service';
import {
	AddressResponseDTO,
	CreateAddressDTO,
	UpdateAddressDTO
} from './address.dtos';
import { Address } from './address.entity';
import { AddressService } from './address.service';
import { AddressConstants as C } from './address.constants';

@ApiTags(C.ADDRESS_API_TAG)
@ApiBearerAuth(C.ACCESS_TOKEN_TYPE)
@Controller(C.ADDRESS_PREFIX)
export class AddressController {
	constructor(
		private addressService: AddressService,
		private customerService: CustomerService
	) {}

	@ApiOperation({ summary: 'Get all addresses for a customer' })
	@ApiResponse({
		status: 200,
		description: 'Returns all addresses for a customer',
		type: [AddressResponseDTO]
	})
	@Get()
	async getAddressByCustomerId(
		@UUIDParam(C.CUSTOMER_ID) customerId: string
	): Promise<AddressResponseDTO[]> {
		const customer = await this.customerService.findById(customerId);

		if (!customer) {
			throw new NotFoundException(`Customer with id ${customerId} not found.`);
		}

		return plainToInstance(
			AddressResponseDTO,
			await this.addressService.getAddressesByCustomer(customer),
			{
				excludeExtraneousValues: true
			}
		);
	}

	@ApiOperation({ summary: 'Get an address by ID' })
	@ApiResponse({
		status: 200,
		description: 'Returns an address by ID',
		type: AddressResponseDTO
	})
	@Get(`:${C.ID}`)
	async getAddressById(
		@UUIDParam(C.CUSTOMER_ID) customerId: string,
		@UUIDParam(C.ID) id: string
	): Promise<AddressResponseDTO> {
		const address = await this.addressService.getAddressById(id);

		if (!address) {
			throw new NotFoundException(`Address with id ${id} not found.`);
		} else if (address.customer.id !== customerId) {
			throw new NotFoundException(
				`Address with id ${id} not found for customer ${customerId}.`
			);
		} else {
			return plainToInstance(AddressResponseDTO, address);
		}
	}

	@ApiOperation({ summary: 'Create an address for a customer' })
	@ApiResponse({
		status: 201,
		description: 'Creates an address for a customer',
		type: AddressResponseDTO
	})
	@Post()
	async createAddress(
		@UUIDParam(C.CUSTOMER_ID) customerId: string,
		@Body() createAddressDTO: CreateAddressDTO,
		@Request() req
	): Promise<AddressResponseDTO> {
		const customer = await this.customerService.findById(customerId);

		if (!customer) {
			throw new NotFoundException(`Customer with id ${customerId} not found.`);
		}

		const address = plainToInstance(Address, createAddressDTO);
		address.customer = customer;
		await this.addressService.createAddress(address, req.user.sub);

		return plainToInstance(AddressResponseDTO, address);
	}

	@ApiOperation({ summary: 'Update an address by ID' })
	@ApiResponse({
		status: 200,
		description: 'Updates an address by ID',
		type: AddressResponseDTO
	})
	@Put(`:${C.ID}`)
	async updateAddress(
		@UUIDParam(C.CUSTOMER_ID) customerId: string,
		@UUIDParam(C.ID) id: string,
		@Body() updateAddressDTO: UpdateAddressDTO,
		@Request() req
	): Promise<AddressResponseDTO> {
		const customer = await this.customerService.findById(customerId);
		const targetAddress = await this.addressService.getAddressById(id);

		if (!customer) {
			throw new NotFoundException(`Customer with id ${customerId} not found.`);
		} else if (!targetAddress) {
			throw new NotFoundException(`Address with id ${id} not found.`);
		} else if (targetAddress.customer.id !== customerId) {
			throw new NotFoundException(
				`Address with id ${id} not found for customer ${customerId}.`
			);
		} else {
			Object.assign(targetAddress, updateAddressDTO);
			await this.addressService.updateAddressById(
				id,
				targetAddress,
				req.user.sub
			);

			return plainToInstance(AddressResponseDTO, targetAddress);
		}
	}
}
