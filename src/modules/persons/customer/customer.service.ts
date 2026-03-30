import {
	BadRequestException,
	Inject,
	Injectable,
	NotFoundException,
	forwardRef
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { BaseVOService } from 'src/data/base-vo/base-vo.service';
import { Address } from 'src/modules/address/address.entity';
import { AddressService } from 'src/modules/address/address.service';
import { Repository } from 'typeorm';
import { CreateCustomerDTO, CustomerFiltersDTO } from './customer-dtos';
import { Customer } from './customer.entity';

@Injectable()
export class CustomerService {
	private voService: BaseVOService;

	constructor(
		@InjectRepository(Customer)
		private readonly customersRepository: Repository<Customer>,
		@Inject(forwardRef(() => AddressService))
		private readonly addressService: AddressService
	) {
		this.voService = BaseVOService.getInstance();
	}
	async findAll(filters?: CustomerFiltersDTO): Promise<Customer[]> {
		const query = this.customersRepository
			.createQueryBuilder('customer')
			.leftJoinAndSelect('customer.addresses', 'addresses');

		if (filters) {
			if (filters.email) {
				query.andWhere('customer.email = :email', { email: filters.email });
			}
			if (filters.firstName) {
				query.andWhere('customer.firstName ILIKE :firstName', {
					firstName: `%${filters.firstName}%`
				});
			}
			if (filters.lastName) {
				query.andWhere('customer.lastName ILIKE :lastName', {
					lastName: `%${filters.lastName}%`
				});
			}
			if (filters.isActive !== undefined) {
				query.andWhere('customer.isActive = :isActive', {
					isActive: filters.isActive
				});
			}
			if (filters.companyName) {
				query.andWhere('customer.companyName ILIKE :companyName', {
					companyName: `%${filters.companyName}%`
				});
			}
			if (filters.search) {
				query.andWhere(
					'(customer.firstName ILIKE :search OR customer.lastName ILIKE :search OR customer.email ILIKE :search OR customer.companyName ILIKE :search)',
					{ search: `%${filters.search}%` }
				);
			}
			if (filters.phone) {
				query.andWhere('customer.phone ILIKE :phone', {
					phone: `%${filters.phone.replace(/[^0-9]/g, '')}%`
				});
			}
		}

		return query.getMany();
	}

	async findById(id: string): Promise<Customer> {
		const customer = await this.customersRepository.findOne({
			where: { id },
			relations: ['addresses']
		});
		if (!customer) {
			throw new NotFoundException(`Customer with ID "${id}" not found`);
		}
		return customer;
	}

	async findByEmail(email: string): Promise<Customer> {
		const customer = await this.customersRepository.findOne({
			where: { email }
		});
		if (!customer) {
			throw new NotFoundException(`Customer with email "${email}" not found`);
		}
		return customer;
	}

	async create(
		createCustomerDto: CreateCustomerDTO,
		createdByUserId: string
	): Promise<Customer> {
		const existing = await this.customersRepository.findOne({
			where: { email: createCustomerDto.email }
		});

		if (existing) {
			throw new BadRequestException('This email is already in use');
		}

		const customer = Customer.create({
			...createCustomerDto,
			createdByUserId
		});

		await this.customersRepository.save(customer);

		createCustomerDto.addresses?.forEach(async (createAddressDTO) => {
			const address = plainToInstance(Address, createAddressDTO);
			await this.addressService.createAddress(address, createdByUserId);
		});

		return customer;
	}

	async updateById(
		id: string,
		customer: Customer,
		updatedByUserId: string
	): Promise<Customer | null> {
		this.voService.handleBaseVOUpdate(customer, updatedByUserId);
		await this.customersRepository.update(id, customer);

		return this.findById(id);
	}

	async archive(id: string): Promise<void> {
		const customer = await this.findById(id);
		customer.isActive = false;
		await this.customersRepository.save(customer);
	}

	async search(term: string, isActive?: boolean): Promise<Customer[]> {
		const query = this.customersRepository
			.createQueryBuilder('customer')
			.where(
				'(customer.firstName ILIKE :term OR customer.lastName ILIKE :term OR customer.email ILIKE :term OR customer.companyName ILIKE :term)',
				{ term: `%${term}%` }
			);

		if (isActive !== undefined) {
			query.andWhere('customer.isActive = :isActive', { isActive });
		}

		return query.getMany();
	}
}
