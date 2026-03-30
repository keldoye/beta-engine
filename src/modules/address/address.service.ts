import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseVOService } from 'src/data/base-vo/base-vo.service';
import { Repository } from 'typeorm';
import { Customer } from '../persons/customer/customer.entity';
import { Address } from './address.entity';
import { relative } from 'path';

@Injectable()
export class AddressService {
	private voService: BaseVOService;

	constructor(
		@InjectRepository(Address)
		private repository: Repository<Address>
	) {
		this.voService = BaseVOService.getInstance();
	}

	async createAddress(address: Address, createByUserId: string) {
		this.voService.handleBaseVOCreation(address, createByUserId);
		return await this.repository.save(address);
	}

	async getAddressById(id: string) {
		const address = await this.repository.findOne({
			where: { id },
			relations: ['customer']
		});

		if (!address) {
			throw new NotFoundException(`Address with id ${id} not found`);
		}

		return address;
	}

	async getAddressesByCustomer(customer: Customer): Promise<Address[]> {
		const addresses = await this.repository.find({
			where: { customer: { id: customer.id } },
			relations: ['customer']
		});

		if (!addresses || addresses.length === 0) {
			throw new NotFoundException(
				`Address not found for customer ${customer.id}.`
			);
		}

		return addresses;
	}

	async updateAddressById(
		id: string,
		address: Address,
		updatedByUserId: string
	) {
		const targetAddress = await this.getAddressById(id);

		if (!targetAddress) {
			throw new NotFoundException(`Address with id ${id} not found`);
		}

		this.voService.handleBaseVOUpdate(address, updatedByUserId);
		await this.repository.update(id, address);
		return this.getAddressById(id);
	}

	async deleteAddressById(id: string) {
		const address = await this.getAddressById(id);

		if (!address) {
			throw new NotFoundException(`Address with id ${id} not found`);
		}

		await this.repository.delete(id);
		return address;
	}
}
