import { PermissionLevel } from 'src/modules/contact/person/user/user-roles.enum';
import { Entity, Column } from 'typeorm';
import { Person } from '../person.entity';

@Entity()
export class User extends Person {
	@Column({ nullable: false, default: PermissionLevel.USER })
	permissionLevel: PermissionLevel;

	@Column({ nullable: false })
	password: string;
}
