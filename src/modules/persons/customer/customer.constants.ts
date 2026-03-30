import { Role } from "../person-roles.enum";

export class CustomerConstants {
    // Swagger and Paths
    static readonly CUSTOMER_API_TAG = 'Customer';
    static readonly CUSTOMER_PREFIX = 'customer';
    static readonly ACCESS_TOKEN_TYPE = 'access-token';
    static readonly ID = 'id';
    static readonly EMAIL = 'email';

    // Authorized roles for each operation
    static readonly ROLES_GET_ALL = [Role.Admin, Role.SU];
    static readonly ROLES_GET_ONE = [Role.Admin, Role.SU, Role.User];
    static readonly ROLES_UPDATE = [Role.Admin, Role.SU, Role.User];
    static readonly ROLES_ARCHIVE = [Role.Admin, Role.SU];
    static readonly ROLES_REQUIRE_OWNERSHIP_WHITELIST = [Role.Admin, Role.SU];

    // Allowed customer filters
    static readonly ALLOWED_CUSTOMER_FILTERS = [
        'email',
        'firstName',
        'lastName',
        'phone',
        'companyName',
        'isActive',
        'search'
    ];
} 