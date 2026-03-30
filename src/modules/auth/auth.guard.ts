import { JwtService } from '@nestjs/jwt';
import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './auth.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private jwtService: JwtService,
		private reflector: Reflector
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
			context.getHandler(),
			context.getClass()
		]);

		const url = context.getArgs()[0].url;

		if (isPublic || url === '/api/task/contact-form') {
			return true;
		}

		const request = context.switchToHttp().getRequest();
		const token = this.extractValidBearerTokenFromHeader(request);

		if (!token) {
			throw new UnauthorizedException(`Invalid bearer token.`);
		}

		try {
			const payload = await this.jwtService.verifyAsync(token, {
				secret: process.env.JWT_SECRET
			});
			request['user'] = payload;
		} catch {
			throw new UnauthorizedException(
				`An error occured while validating the access token.`
			);
		}

		return true;
	}

	private extractValidBearerTokenFromHeader(request: Request): string | null {
		const [type, token] = request.headers['authorization']?.split(' ') ?? [];
		return type === 'Bearer' ? token : null;
	}
}
