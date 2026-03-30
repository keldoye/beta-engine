import { BaseVO } from 'src/data/base-vo/base-vo.abstract';
import { Column } from 'typeorm';
import { PersonTitle } from './titles.enum';

export abstract class Person extends BaseVO {
	@Column({ nullable: true, default: PersonTitle.X })
	title?: PersonTitle;

	@Column()
	firstName: string;

	@Column()
	lastName: string;

	@Column()
	email: string;

	@Column({ nullable: true })
	phone?: string;

	@Column({ nullable: true })
	dateOfBirth?: Date;
}
