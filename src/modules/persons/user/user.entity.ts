import { Role } from 'src/modules/persons/person-roles.enum';
import { Entity, Column } from 'typeorm';
import { Person } from '../person.abstract';

@Entity()
export class User extends Person {
	@Column({ nullable: false, default: Role.User })
	role: Role;

	@Column({ nullable: false })
	password: string;
}
