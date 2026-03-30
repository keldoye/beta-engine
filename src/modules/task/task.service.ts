import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseVOService } from 'src/data/base-vo/base-vo.service';
import { TaskStatus } from './task.constants';
import { Customer } from '../persons/customer/customer.entity';
import { TaskFiltersDTO } from './task.dtos';

@Injectable()
export class TaskService {
	private voService: BaseVOService;

	constructor(
		@InjectRepository(Task)
		private repository: Repository<Task>
	) {
		this.voService = BaseVOService.getInstance();
	}

	async create(task: Task, userId: string): Promise<Task> {
		this.voService.handleBaseVOCreation(task, userId);
		return await this.repository.save(task);
	}

	async getAllTasks(): Promise<Task[]> {
		return await this.repository.find({
			order: { status: 'DESC' },
			relations: ['customer']
		});
	}

	async findAll(filters?: TaskFiltersDTO): Promise<Task[]> {
		const query = this.repository
			.createQueryBuilder('task')
			.leftJoinAndSelect('task.customer', 'customer');

		if (filters) {
			if (filters.status) {
				if (Array.isArray(filters.status))
					query.andWhere('task.status IN (:...status)', { status: filters.status });
				else
					query.andWhere('task.status = :status', { status: filters.status });
			}

			if (filters.type) {
				if (Array.isArray(filters.type))
					query.andWhere('task.type IN (:...type)', { type: filters.type });
				else
					query.andWhere('task.type = :type', { type: filters.type });
			}

			if (filters.customerId)
				query.andWhere('task.customerId = :customerId', { customerId: filters.customerId });

			if (filters.dueDate)
				query.andWhere('task.dueDate = :dueDate', { dueDate: filters.dueDate });

			if (filters.createdAt)
				query.andWhere('task.creationDateTime = :createdAt', { createdAt: filters.createdAt });

			if (filters.search)
				query.andWhere(
					'(task.status ILIKE :search OR task.type ILIKE :search OR task.customerId ILIKE :search OR task.dueDate ILIKE :search OR task.creationDateTime ILIKE :search)',
					{ search: `%${filters.search}%` }
				);
		}

		query.orderBy('task.creationDateTime', 'DESC');

		return query.getMany();
	}


	async getTasksByStatus(status: TaskStatus): Promise<Task[]> {
		return await this.repository.find({
			where: { status },
			relations: ['customer'],
			order: { status: 'DESC' }
		});
	}

	async getTasksByCustomer(customer: Customer): Promise<Task[]> {
		return await this.repository.find({
			where: { customer: { id: customer.id } },
			relations: ['customer']
		});
	}

	async getTaskById(id: string): Promise<Task> {
		const task = await this.repository.findOne({
			where: { id },
			relations: ['customer']
		});

		if (!task) {
			throw new NotFoundException(`No task found for this id ${id}`);
		}
		return task;
	}

	async updateTaskById(id: string, task: Task, userId: string): Promise<Task> {
		this.voService.handleBaseVOUpdate(task, userId);
		await this.repository.update(id, task);

		return this.getTaskById(id);
	}
}
