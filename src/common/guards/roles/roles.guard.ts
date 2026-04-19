import {
	Injectable,
	CanActivate,
	ExecutionContext,
	ForbiddenException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionLevel } from 'src/modules/contact/person/user/user-roles.enum';
import { IS_PUBLIC_KEY } from 'src/auth/auth.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
			context.getHandler(),
			context.getClass()
		]);

		if (isPublic) {
			return true;
		}

		const requiredPermissionLevels = this.reflector.get<PermissionLevel[]>(
			'permissionLevels',
			context.getHandler()
		);

		if (!requiredPermissionLevels) {
			return true; // No roles required
		}

		const request = context.switchToHttp().getRequest();
		const user = request.user;

		if (!user) {
			throw new ForbiddenException('User not authenticated');
		}

		const hasRequiredRole = requiredPermissionLevels.some(
			(permissionLevel) =>
				user.permissionLevel.toLowerCase() === permissionLevel.toLowerCase()
		);

		if (!hasRequiredRole) {
			throw new ForbiddenException(
				'You do not have the required permission level(s) to access this resource'
			);
		}

		return true;
	}
}
