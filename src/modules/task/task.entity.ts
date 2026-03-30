import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseVO } from 'src/data/base-vo/base-vo.abstract';
import { Customer } from '../persons/customer/customer.entity';
import { TaskStatus, TaskType } from './task.constants';

@Entity()
export class Task extends BaseVO {
	@ManyToOne(() => Customer, (customer) => customer.tasks)
	customer: Customer;

	@Column({ nullable: true })
	notes?: string;

	@Column({ nullable: true })
	dueDate?: Date;

	@Column()
	consent: boolean;

	@Column({ default: TaskStatus.OPEN })
	status: TaskStatus;

	@Column()
	type: TaskType;
}
