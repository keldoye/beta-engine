import {
	Injectable,
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	NotFoundException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
	RESOURCE_KEY,
	ResourceMetadata,
	CHECK_RESOURCE
} from './decorators/resource.decorator';
import { ModuleRef } from '@nestjs/core';
import { Role } from 'src/modules/persons/person-roles.enum';
import { IS_PUBLIC_KEY } from 'src/modules/auth/auth.decorator';

@Injectable()
export class ResourceOwnerGuard<T> implements CanActivate {
	constructor(
		private reflector: Reflector,
		private moduleRef: ModuleRef
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
			context.getHandler(),
			context.getClass()
		]);

		if (isPublic) {
			return true;
		}

		const metadata = this.reflector.get<ResourceMetadata<T>>(
			RESOURCE_KEY,
			context.getClass()
		);
		const resourceCheck = this.reflector.get<{ roleWhitelist?: Role[] }>(
			CHECK_RESOURCE,
			context.getHandler()
		);

		if (!metadata || !resourceCheck) {
			return true;
		}

		const request = context.switchToHttp().getRequest();
		const user = request.user;
		const resourceId = request.params.id;

		if (!resourceId || !user) {
			throw new ForbiddenException(
				'User not authenticated or resource ID not provided'
			);
		}

		// Check if user has a whitelisted role that bypasses ownership check
		if (resourceCheck.roleWhitelist?.includes(user.role)) {
			return true;
		}

		try {
			// Get the service instance using the type provided in metadata
			const service = this.moduleRef.get(metadata.service, { strict: false });
			if (!service || !service.findOne) {
				throw new ForbiddenException('Service not properly configured');
			}

			const resource = await service.findOne(resourceId);
			if (!resource) {
				throw new NotFoundException(`Resource not found`);
			}

			// If a custom ownership check function is provided, use it
			if (metadata.checkOwnership) {
				return metadata.checkOwnership(resource as T, user);
			}

			// Default ownership check using owner ID field
			const ownerIdField = metadata.ownerIdField || 'userId';
			if (resource[ownerIdField] !== user.sub) {
				throw new ForbiddenException(
					`You don't have permission to access this ${metadata.resourceName}`
				);
			}

			return true;
		} catch (error) {
			if (
				error instanceof ForbiddenException ||
				error instanceof NotFoundException
			) {
				throw error;
			}
			throw new ForbiddenException('Error checking resource ownership');
		}
	}
}
