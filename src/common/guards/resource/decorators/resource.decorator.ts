import { SetMetadata } from '@nestjs/common';
import { Type } from '@nestjs/common';
import { Role } from 'src/modules/persons/person-roles.enum';
import { JwtPayload } from 'src/modules/auth/jwt-payload.vo';

export const RESOURCE_KEY = 'resource';

export interface ResourceMetadata<T> {
    resourceName: string;
    ownerIdField?: string;
    roleWhitelist?: Role[];
    checkOwnership?: (resource: T, user: JwtPayload) => boolean | Promise<boolean>;
    service: Type<any>;
}

export const Resource = <T>(metadata: ResourceMetadata<T>) => SetMetadata(RESOURCE_KEY, metadata);

// Resource check decorator
export const CHECK_RESOURCE = 'requireOwnership';
export const RequireOwnership = (roleWhitelist?: Role[]) => SetMetadata(CHECK_RESOURCE, { roleWhitelist }); 