import { Address } from 'src/modules/address/address.entity';
import { Person } from 'src/modules/persons/person.abstract';
import { Task } from 'src/modules/task/task.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class Customer extends Person {
	@Column({ default: true })
	isActive: boolean;

	@Column({ nullable: true })
	companyName?: string;

	@OneToMany(() => Address, (address) => address.customer, {
		nullable: true
	})
	addresses: Address[];

	@OneToMany(() => Task, (task) => task.customer, { nullable: true })
	tasks: Task[];

	public static create(params: {
		firstName: string;
		lastName: string;
		companyName?: string;
		email: string;
		phone?: string;
		createdByUserId: string;
	}): Customer {
		const customer = new Customer();
		Object.assign(customer, params);
		customer.isActive = true;
		return customer;
	}
}
