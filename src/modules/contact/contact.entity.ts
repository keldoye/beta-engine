import { BaseVO } from "src/data/base-vo/base-vo.abstract";
import { Column } from "typeorm";
import { ContactSubtype } from "./contactsubtype.enum";

export abstract class Contact extends BaseVO {
	@Column()
	contactSubtype: ContactSubtype;

	@Column()
	primaryEmail : string;

	@Column()
	primaryPhone? : string;
}