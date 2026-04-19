import { Column, Entity } from 'typeorm';
import { PersonTitle } from './person-titles.enum';
import { Contact } from '../contact.entity';

@Entity()
export class Person extends Contact {
	@Column({ nullable: true })
	title?: PersonTitle;

	@Column()
	firstName: string;

	@Column()
	lastName: string;

	@Column({ nullable: true })
	dateOfBirth?: Date;
}
