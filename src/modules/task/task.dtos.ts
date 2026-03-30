import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
	IsBoolean,
	IsDate,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUUID,
	MaxLength,
	ValidateNested
} from 'class-validator';
import { TaskStatus, TaskType } from './task.constants';
import { Expose, Transform, Type } from 'class-transformer';
import {
	CreateCustomerDTO,
	CustomerResponseDTO
} from '../persons/customer/customer-dtos';
import { BaseVOResponseDTO } from 'src/data/base-vo/base-vo.dto';
import { plainToInstance } from 'class-transformer';
import { NoValidate } from 'src/common/decorators/no-validate.decorator';

/**
 * This is the raw data from the contact form, used to create a CreateTaskDTO.
 * The frontend does not send structured data, for security reasons.
 */
@NoValidate()
export class CreateRawTaskDTO {
	firstName: string;
	lastName: string;
	email: string;
	message: string;
	consent: boolean;
}

export class CreateTaskDTO {
	@ApiProperty({
		description: 'Content of the task'
	})
	@IsOptional()
	@IsString()
	notes?: string;

	@ApiProperty({
		description: 'Due date of the task'
	})
	@IsOptional()
	@IsDate()
	@Transform(({ value }) => (value ? new Date(value) : undefined))
	dueDate?: Date;

	@ApiProperty({
		description: 'Consent of the customer',
		type: Boolean,
		example: true
	})
	@IsBoolean()
	@IsNotEmpty()
	@Transform(({ value }) => {
		if (typeof value === 'string') {
			return value.toLowerCase() === 'true';
		}
		return value;
	})
	consent: boolean;

	@ApiProperty({
		description: 'Status of the task',
		enum: TaskStatus,
		example: TaskStatus.OPEN
	})
	@IsEnum(TaskStatus)
	@IsNotEmpty()
	status: TaskStatus;

	@ApiProperty({
		description: 'Task type',
		enum: TaskType,
		example: TaskType.CONTACT_FORM
	})
	@IsNotEmpty()
	@IsEnum(TaskType)
	type: TaskType;
}

export class UpdateTaskDTO extends PartialType(CreateTaskDTO) { }

@Expose()
export class TaskResponseDTO extends BaseVOResponseDTO {
	@Expose()
	@ApiProperty({
		description: 'Content of th task'
	})
	notes?: string;

	@Expose()
	@ApiProperty({
		description: 'Due date of the task',
		type: Date,
		example: '2025-01-01'
	})
	dueDate?: Date;

	@Expose()
	@ApiProperty({
		description: 'Consent of the customer'
	})
	consent: boolean;

	@Expose()
	@ApiProperty({
		description: 'Status of the task'
	})
	status: TaskStatus;

	@Expose()
	@ApiProperty({
		description: 'Task type'
	})
	type: TaskType;

	@Expose()
	@ApiProperty({
		description: 'Customer',
		type: CustomerResponseDTO
	})
	customer: CustomerResponseDTO;
}

@Expose()
export class ContactFormDTO {
	@Expose()
	@ApiProperty({
		description: 'Customer',
		type: () => CreateCustomerDTO
	})
	@ValidateNested()
	@Type(() => CreateCustomerDTO)
	@Transform(({ value }) => {
		if (typeof value === 'object') {
			return plainToInstance(CreateCustomerDTO, value);
		}
		return value;
	})
	customer: CreateCustomerDTO;

	@Expose()
	@ApiProperty({
		description: 'Task',
		type: () => CreateTaskDTO,
		required: true
	})
	@ValidateNested()
	@Type(() => CreateTaskDTO)
	task: CreateTaskDTO;
}

export class TaskFiltersDTO {
	@ApiProperty({
		description: 'The status of the task',
		required: false,
		enum: TaskStatus,
		isArray: true,
		example: [TaskStatus.OPEN, TaskStatus.IN_PROGRESS]
	})
	@Transform(({ value }) => {
		if (typeof value === 'string') {
			return value.split(',').map(status => status.trim());
		}
		return value;
	})
	@IsEnum(TaskStatus, { each: true })
	@IsOptional()
	status?: TaskStatus | TaskStatus[];

	@ApiProperty({
		description: 'The type of the task',
		required: false,
		enum: TaskType,
		isArray: true,
		example: [TaskType.CONTACT_FORM]
	})
	@Transform(({ value }) => {
		if (typeof value === 'string') {
			return value.split(',').map(type => type.trim());
		}
		return value;
	})
	@IsEnum(TaskType, { each: true })
	@IsOptional()
	type?: TaskType | TaskType[];

	@ApiProperty({
		description: 'The customer id of the task',
		required: false,
		example: '123e4567-e89b-12d3-a456-426614174000'
	})
	@IsUUID()
	@IsOptional()
	customerId?: string;

	@ApiProperty({
		description: 'The due date of the task',
		required: false,
		example: '2025-01-01'
	})
	@IsOptional()
	@IsDate()
	dueDate?: string;


	@ApiProperty({
		description: 'The created at date of the task',
		required: false,
		example: '2025-01-01'
	})
	@IsDate()
	@IsOptional()
	createdAt?: string;


	@ApiProperty({
		description: 'The search term for the task',
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