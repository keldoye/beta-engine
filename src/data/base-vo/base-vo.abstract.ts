import {
	Column,
	CreateDateColumn,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm';
import { DataConstants as Constants } from '../data.constants';

export abstract class BaseVO {
	@PrimaryGeneratedColumn(Constants.UUID)
	id: string;

	@CreateDateColumn({ type: Constants.TIMESTAMP })
	creationDateTime: Date;

	@Column()
	createdByUserId: string;

	@UpdateDateColumn({ type: Constants.TIMESTAMP })
	lastUpdateDateTime?: Date;

	@Column({ nullable: true })
	lastUpdateByUserId?: string;

	@Column({ type: Constants.INT, default: 1 })
	version: number;
}
