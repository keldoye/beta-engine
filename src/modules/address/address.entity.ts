import { BaseVO } from 'src/data/base-vo/base-vo.abstract';
import { Entity, Column, ManyToOne } from 'typeorm';
import { Province } from './address.constants';
import { Customer } from '../persons/customer/customer.entity';

@Entity()
export class Address extends BaseVO {
	@Column()
	streetNumber: string;

	@Column({ nullable: true })
	aptNumber: string;

	@Column()
	streetName: string;

	@Column()
	city: string;

	@Column({ default: Province.QC })
	province: Province;

	@ManyToOne(() => Customer, (customer) => customer.addresses, {
		onDelete: 'CASCADE'
	})
	customer: Customer;
}
