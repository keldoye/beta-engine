import {
	Column,
	CreateDateColumn,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm';
import { DataConstants as C } from '../data.constants';

export abstract class BaseVO {
	@PrimaryGeneratedColumn(C.UUID)
	id: string;

	@CreateDateColumn({ type: C.TIMESTAMP })
	creationDateTime: Date;

	@Column()
	createdByUserId: string;

	@UpdateDateColumn({ type: C.TIMESTAMP })
	lastUpdateDateTime?: Date;

	@Column({ nullable: true })
	lastUpdateByUserId?: string;

	@Column({ type: C.INT, default: 1 })
	version: number;
}
