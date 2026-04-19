import { AuthConstants } from 'src/auth/auth.constants';

export class UserConstants {
	private constructor() {}

	static readonly SU_FIRSTNAME = 'Super';
	static readonly SU_LASTNAME = 'User';
	static readonly SU_USERNAME = 'super@user.io';
	static readonly SU_PASSWORD = 'su';
	static readonly SU_SELF = 'self';
	static readonly SU_PHONE = '201-333-1212'

	// Encryption
	static readonly SALT_ROUNDS = 10;

	// Swagger and Paths
	static readonly USER_API_TAG = 'Users';
	static readonly USER_API_PREFIX = 'users';
	static readonly ACCESS_TOKEN_TYPE = AuthConstants.ACCESS_TOKEN_TYPE;
	static readonly ID = 'id';
	static readonly EMAIL = 'email';
}
