import { PermissionLevel } from "../modules/contact/person/user/user-roles.enum";

export class JwtPayload {
    constructor(
        public readonly sub: string,
        public readonly email: string,
        public readonly permissionLevel: PermissionLevel,
        public readonly iat?: number,
        public readonly exp?: number
    ) { }

    static create(params: {
        sub: string,
        email: string,
        permissionLevel: PermissionLevel
    }): JwtPayload {
        return new JwtPayload(
            params.sub,
            params.email,
            params.permissionLevel
        );
    }
} 