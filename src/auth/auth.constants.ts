import 'dotenv/config';

export class AuthConstants {
	private constructor() {}

	static readonly AUTH_PREFIX = 'auth';
	static readonly ACCESS_TOKEN_TYPE = 'access-token';
	static readonly TOKEN_TIMEOUT = '3h';
	static readonly PROFILE = 'profile';

	// Default JWT secret to be set as environment variable
	static readonly JWT_SECRET = process.env.JWT_SECRET as string;
}
