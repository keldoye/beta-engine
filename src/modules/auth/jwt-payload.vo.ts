import { Role } from "../persons/person-roles.enum";

export class JwtPayload {
    constructor(
        public readonly sub: string,
        public readonly email: string,
        public readonly role: Role,
        public readonly iat?: number,
        public readonly exp?: number
    ) { }

    static create(params: {
        sub: string,
        email: string,
        role: Role
    }): JwtPayload {
        return new JwtPayload(
            params.sub,
            params.email,
            params.role
        );
    }
} 