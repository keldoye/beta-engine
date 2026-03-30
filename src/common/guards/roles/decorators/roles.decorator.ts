import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/modules/persons/person-roles.enum';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles); 