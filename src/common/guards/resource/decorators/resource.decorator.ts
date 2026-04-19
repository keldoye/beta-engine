import { SetMetadata } from '@nestjs/common';
import { Type } from '@nestjs/common';
import { PermissionLevel } from 'src/modules/contact/person/user/user-roles.enum';
import { JwtPayload } from 'src/auth/jwt-payload.vo';

export const RESOURCE_KEY = 'resource';

export interface ResourceMetadata<T> {
    resourceName: string;
    ownerIdField?: string;
    permissionLevel?: PermissionLevel[];
    checkOwnership?: (resource: T, user: JwtPayload) => boolean | Promise<boolean>;
    service: Type<any>;
}

export const Resource = <T>(metadata: ResourceMetadata<T>) => SetMetadata(RESOURCE_KEY, metadata);

// Resource check decorator
export const CHECK_RESOURCE = 'requireOwnership';
export const RequireOwnership = (permissionLevel?: PermissionLevel[]) => SetMetadata(CHECK_RESOURCE, { permissionLevel }); 