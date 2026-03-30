import { AuthConstants } from 'src/modules/auth/auth.constants';

export class UserConstants {
	private constructor() {}

	static readonly SU_FIRSTNAME = 'Super';
	static readonly SU_LASTNAME = 'User';
	static readonly SU_USERNAME = 'super@user.io';
	static readonly SU_PASSWORD = 'su';
	static readonly SU_SELF = 'self';

	// Encryption
	static readonly SALT_ROUNDS = 10;

	// Swagger and Paths
	static readonly USER_API_TAG = 'User';
	static readonly USER_PREFIX = 'user';
	static readonly ACCESS_TOKEN_TYPE = AuthConstants.ACCESS_TOKEN_TYPE;
	static readonly ID = 'id';
	static readonly EMAIL = 'email';
}
