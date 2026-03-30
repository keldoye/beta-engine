import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export abstract class BaseVOResponseDTO {
	@Expose()
	@ApiProperty({
		description: 'The object id	',
		example: '123e4567-e89b-12d3-a456-426614174000'
	})
	id: string;

	@Expose()
	@ApiProperty({
		description: 'The date when the object was created',
		example: '2024-03-15T10:30:00Z'
	})
	creationDateTime: Date;

	@Expose()
	@ApiProperty({
		description: 'The ID of the user who created the object',
		example: '123e4567-e89b-12d3-a456-426614174000'
	})
	createdByUserId: string;

	@Expose()
	@ApiProperty({
		description: 'The date when the object was last updated',
		example: '2024-03-15T14:45:00Z'
	})
	lastUpdateDateTime: Date;

	@Expose()
	@ApiProperty({
		description: 'The ID of the user who last updated the object',
		example: '123e4567-e89b-12d3-a456-426614174000',
		required: false
	})
	lastUpdateByUserId: string;

	@Expose()
	@ApiProperty({
		description:
			'The version of the object. Updated on each object modification'
	})
	version: number;
}
