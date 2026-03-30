import {
	Body,
	Controller,
	ForbiddenException,
	Get,
	HttpStatus,
	NotFoundException,
	ParseEnumPipe,
	Post,
	Put,
	Query,
	Request,
	UseGuards,
} from '@nestjs/common';
import {
	ApiBearerAuth,
	ApiOperation,
	ApiQuery,
	ApiResponse,
	ApiTags
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { UUIDParam } from 'src/common/decorators/uuid-param.decorator';
import { CustomerService } from '../persons/customer/customer.service';
import {
	CreateTaskDTO,
	ContactFormDTO,
	TaskResponseDTO,
	UpdateTaskDTO,
	CreateRawTaskDTO,
	TaskFiltersDTO
} from './task.dtos';
import { Task } from './task.entity';
import { TaskService } from './task.service';
import { TaskStatus, TaskType, ALLOWED_TASK_FILTERS, ROLES_GET_ALL } from './task.constants';
import { Customer } from '../persons/customer/customer.entity';
import { Public } from '../auth/auth.decorator';
import { QueryValidationPipe } from 'src/common/pipes/query-validation.pipe';
import { TASK_API_TAG, TASK_PREFIX, ACCESS_TOKEN_TYPE } from './task.constants';
import { Roles } from 'src/common/guards/roles/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';

@ApiTags(TASK_API_TAG)
@ApiBearerAuth(ACCESS_TOKEN_TYPE)
@Controller(TASK_PREFIX)
@UseGuards(RolesGuard)
export class TaskController {
	constructor(
		private taskService: TaskService,
		private customerService: CustomerService
	) { }


	@Get()
	@Roles(...ROLES_GET_ALL)
	@ApiOperation({ summary: 'Get all tasks with filters' })
	@ApiResponse({
		status: 200,
		description: 'Returns all tasks.',
		type: [TaskResponseDTO]
	})
	@ApiQuery({
		name: 'filters',
		type: TaskFiltersDTO,
		required: false,
		description: 'Filters to apply to the tasks',
	})
	async findAll(
		@Query(new QueryValidationPipe(ALLOWED_TASK_FILTERS))
		filters?: TaskFiltersDTO
	): Promise<TaskResponseDTO[]> {
		console.log('findAll');
		const tasks = await this.taskService.findAll(filters);
		return tasks.map((task) =>
			plainToInstance(TaskResponseDTO, task)
		);
	}

	@ApiOperation({
		summary:
			'Creates a new task and a new customer propsect. Used in the contact form'
	})
	@ApiResponse({
		status: 201,
		description: 'Returns nothing, as it is used in the contact form'
	})
	@Post('contact-form')
	@Public()
	async createTaskFromContactForm(
		@Body() body: CreateRawTaskDTO
	): Promise<HttpStatus> {
		// This is made server side to avoid exposing the data structure on client side
		const parsedBody = {
			task: {
				consent: body.consent,
				dueDate: null,
				status: TaskStatus.OPEN,
				type: TaskType.CONTACT_FORM,
				notes: body.message,
			},
			customer: {
				firstName: body.firstName,
				lastName: body.lastName,
				email: body.email,
			}
		}

		let customer: Customer;
		const systemUserId = 'sys';	// For public routes
		const contactFormDTO = plainToInstance(ContactFormDTO, parsedBody);
		const taskEntity = plainToInstance(Task, contactFormDTO.task);
		const customerEntity = plainToInstance(Customer, contactFormDTO.customer);

		// Get or create customer
		try {
			customer = await this.customerService.findByEmail(customerEntity.email);
		} catch (error) {
			if (error instanceof NotFoundException)
				customer = await this.customerService.create(customerEntity, systemUserId);
			else throw error;
		}

		taskEntity.customer = customer;
		await this.taskService.create(taskEntity, systemUserId);

		return HttpStatus.CREATED;
	}

	@Post(':customerId')
	@ApiOperation({ summary: 'Create a new task for a specific customer' })
	@ApiResponse({
		status: 201,
		description: 'The task has been successfully created.',
		type: TaskResponseDTO
	})
	async createTask(
		@UUIDParam('customerId') customerId: string,
		@Body() createTaskDTO: CreateTaskDTO,
		@Request() req
	): Promise<TaskResponseDTO> {
		const customer = await this.customerService.findById(customerId);

		if (!customer) {
			throw new NotFoundException(`No customer for this id: ${customerId}`);
		}

		const task = plainToInstance(Task, createTaskDTO);
		task.customer = customer;

		await this.taskService.create(task, req.user.sub);
		return plainToInstance(TaskResponseDTO, task);
	}


	@ApiOperation({ summary: 'Return tasks by customer' })
	@ApiResponse({
		status: 200,
		type: [TaskResponseDTO]
	})
	@Get(':customerId')
	async getTasksByCustomer(
		@UUIDParam('customerId') customerId: string
	): Promise<TaskResponseDTO[]> {
		const customer = await this.customerService.findById(customerId);

		if (!customer) {
			throw new NotFoundException(`No customer for this id: ${customerId}`);
		}

		const tasks = await this.taskService.getTasksByCustomer(customer);

		return plainToInstance(TaskResponseDTO, tasks);
	}


	@ApiOperation({ summary: 'Get tasks by status' })
	@ApiQuery({
		name: 'status',
		enum: TaskStatus,
		description: 'Filter tasks by status',
		required: true
	})
	@ApiResponse({
		status: 200,
		description: 'Returns all tasks with the specified status',
		type: [TaskResponseDTO]
	})
	@Get('status/filter')
	async getTasksByStatus(
		@Query('status', new ParseEnumPipe(TaskStatus)) status: TaskStatus
	): Promise<TaskResponseDTO[]> {
		const tasks = await this.taskService.getTasksByStatus(status);

		if (!tasks || tasks.length === 0) {
			throw new NotFoundException(`No tasks found with status: ${status}`);
		}

		return plainToInstance(TaskResponseDTO, tasks);
	}

	@ApiOperation({ summary: 'Get task by id for a specific customer' })
	@ApiResponse({
		status: 200,
		description: 'Returns the task',
		type: TaskResponseDTO
	})
	@Get(':id/customer/:customerId')
	async getTaskById(
		@UUIDParam('id') id: string,
		@UUIDParam('customer') customerId: string
	): Promise<TaskResponseDTO> {
		const customer = await this.customerService.findById(customerId);

		if (!customer) {
			throw new NotFoundException(`No customer for this id: ${customerId}`);
		}

		const task = await this.taskService.getTaskById(id);

		if (!task) {
			throw new NotFoundException(`No task found for this id: ${id}`);
		} else if (task.customer.id !== customer.id) {
			throw new ForbiddenException('You are not allowed to update this task');
		}

		return plainToInstance(TaskResponseDTO, task);
	}

	@ApiOperation({ summary: 'Update task by id for a specific customer' })
	@ApiResponse({
		status: 200,
		description: 'Returns the updated task',
		type: TaskResponseDTO
	})
	@Put(':id/customer/:customerId')
	async updateTaskById(
		@UUIDParam('id') id: string,
		@UUIDParam('customerId') customerId: string,
		@Body() updateTaskDTO: UpdateTaskDTO,
		@Request() req
	): Promise<TaskResponseDTO> {
		const customer = await this.customerService.findById(customerId);

		if (!customer) {
			throw new NotFoundException(`No customer for this id: ${customerId}`);
		}

		const existingTask = await this.taskService.getTaskById(id);

		if (!existingTask) {
			throw new NotFoundException(`No task found for this id: ${id}`);
		} else if (existingTask.customer.id !== customer.id) {
			throw new ForbiddenException('You are not allowed to update this task');
		}

		// Merge the update with the existing task
		Object.assign(existingTask, updateTaskDTO);
		existingTask.customer = customer; // Ensure customer relation is preserved

		const updatedTask = await this.taskService.updateTaskById(
			id,
			existingTask,
			req.user.sub
		);
		return plainToInstance(TaskResponseDTO, updatedTask);
	}
}
