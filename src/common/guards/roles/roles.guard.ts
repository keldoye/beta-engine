import {
	Injectable,
	CanActivate,
	ExecutionContext,
	ForbiddenException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/modules/persons/person-roles.enum';
import { IS_PUBLIC_KEY } from 'src/modules/auth/auth.decorator';

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

		const requiredRoles = this.reflector.get<Role[]>(
			'roles',
			context.getHandler()
		);
		if (!requiredRoles) {
			return true; // No roles required
		}

		const request = context.switchToHttp().getRequest();
		const user = request.user;

		if (!user) {
			throw new ForbiddenException('User not authenticated');
		}

		const hasRequiredRole = requiredRoles.some(
			(role) => user.role.toLowerCase() === role.toLowerCase()
		);
		if (!hasRequiredRole) {
			throw new ForbiddenException(
				'You do not have the required roles to access this resource'
			);
		}

		return true;
	}
}
