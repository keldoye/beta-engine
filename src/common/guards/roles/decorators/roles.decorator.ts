import { SetMetadata } from '@nestjs/common';
import { PermissionLevel } from 'src/modules/contact/person/user/user-roles.enum';

export const AllowedPermissionLevel = (...permissionLevels: PermissionLevel[]) => SetMetadata('permissionLevels', permissionLevels); 