import { BaseVO } from './base-vo.abstract';

/**
 * Singleton class that handles update-specific fields on any entity that is subtyped from the BaseVO abstract.
 *
 * @param vo The value object that received the update
 * @param userId ID of the user who makes the update
 */
export class BaseVOService {
	protected constructor() {}

	private static instance: BaseVOService;

	/**
	 * @returns The instance of the class, initializes it if it is null.
	 */
	public static getInstance(): BaseVOService {
		return this.instance ?? (this.instance = new BaseVOService());
	}

	handleBaseVOUpdate(vo: BaseVO, userId: string) {
		vo.version++;
		vo.lastUpdateDateTime = new Date();
		vo.lastUpdateByUserId = userId;
	}

	handleBaseVOCreation(vo: BaseVO, userId: string) {
		vo.createdByUserId = userId;
	}
}
