import {
	Body,
	Controller,
	Get,
	NotFoundException,
	Post,
	Put,
	Query,
	Request,
	UseGuards
} from '@nestjs/common';
import {
	ApiBearerAuth,
	ApiOperation,
	ApiResponse,
	ApiQuery,
	ApiTags
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { UUIDParam } from '../../../common/decorators/uuid-param.decorator';
import { ResourceOwnerGuard } from '../../../common/guards/resource/resource-owner.guard';
import { Roles } from '../../../common/guards/roles/decorators/roles.decorator';
import { RolesGuard } from '../../../common/guards/roles/roles.guard';
import { QueryValidationPipe } from '../../../common/pipes/query-validation.pipe';
import {
	CreateCustomerDTO,
	CustomerFiltersDTO,
	CustomerResponseDTO,
	UpdateCustomerDTO
} from './customer-dtos';
import { CustomerConstants as C } from './customer.constants';
import { CustomerService } from './customer.service';



@ApiTags(C.CUSTOMER_API_TAG)
@Controller(C.CUSTOMER_PREFIX)
@ApiBearerAuth(C.ACCESS_TOKEN_TYPE)
@UseGuards(RolesGuard, ResourceOwnerGuard)
export class CustomerController {
	constructor(private readonly customerService: CustomerService) { }

	@Get()
	@Roles(...C.ROLES_GET_ALL)
	@ApiOperation({ summary: 'Get all customers with filters' })
	@ApiResponse({
		status: 200,
		description: 'Returns all customers.',
		type: [CustomerResponseDTO]
	})
	@ApiQuery({
		name: 'filters',
		type: CustomerFiltersDTO,
		required: false,
		description: 'Filters to apply to the customers',
	})
	async findAll(
		@Query(new QueryValidationPipe(C.ALLOWED_CUSTOMER_FILTERS))
		filters?: CustomerFiltersDTO
	): Promise<CustomerResponseDTO[]> {
		const customers = await this.customerService.findAll(filters);
		return customers.map((customer) =>
			plainToInstance(CustomerResponseDTO, customer)
		);
	}

	@Get(`:${C.ID}`)
	@Roles(...C.ROLES_GET_ONE)
	@ApiOperation({ summary: 'Get a customer by ID' })
	@ApiResponse({
		status: 200,
		description: 'Returns the customer.',
		type: CustomerResponseDTO
	})
	async findOne(@UUIDParam(C.ID) id: string): Promise<CustomerResponseDTO> {
		const customer = await this.customerService.findById(id);
		return plainToInstance(CustomerResponseDTO, customer);
	}

	@Post()
	@Roles(...C.ROLES_GET_ALL)
	@ApiOperation({ summary: 'Create a new customer' })
	@ApiResponse({
		status: 201,
		description: 'Customer successfully created.',
		type: CustomerResponseDTO
	})
	async create(
		@Request() req,
		@Body() createCustomerDto: CreateCustomerDTO
	): Promise<CustomerResponseDTO> {
		const customer = await this.customerService.create(
			createCustomerDto,
			req.user.sub
		);
		return plainToInstance(CustomerResponseDTO, customer);
	}

	@Put(`:${C.ID}`)
	@Roles(...C.ROLES_UPDATE)
	@ApiOperation({ summary: 'Update a customer' })
	@ApiResponse({
		status: 200,
		description: 'Customer successfully updated.',
		type: CustomerResponseDTO
	})
	async update(
		@Request() req,
		@UUIDParam(C.ID) id: string,
		@Body() updateCustomerDTO: UpdateCustomerDTO
	): Promise<CustomerResponseDTO> {
		const customer = await this.customerService.findById(id);

		if (customer) {
			const requestUser = req.user;
			Object.assign(customer, updateCustomerDTO);

			await this.customerService.updateById(id, customer, requestUser.sub);

			return plainToInstance(CustomerResponseDTO, customer);
		} else {
			throw new NotFoundException(`No customer with ID: ${id}`);
		}
	}

	// @Put(`:${C.ID}/archive`)
	// @Roles(...C.ROLES_ARCHIVE)
	// @ApiOperation({ summary: 'Archive a customer' })
	// @ApiResponse({ status: 200, description: 'Customer successfully archived.' })
	// async archive(@UUIDParam(C.ID) id: string): Promise<void> {
	//     return await this.customerService.archive(id);
	// }
}
