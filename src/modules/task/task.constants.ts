import { AuthConstants } from "../auth/auth.constants";
import { Role } from "../persons/person-roles.enum";

export enum TaskStatus {
  OPEN = "OPEN",
  CLOSE = "CLOSE",
  IN_PROGRESS = "IN_PROGRESS",
  ON_HOLD = "ON_HOLD",
}

export enum TaskType {
  CONTACT_FORM = "CONTACT_FORM",
}

// Allowed task filters
export const ALLOWED_TASK_FILTERS = [
  'status',
  'type',
  'customerId',
  'createdAt',
  'search'
];

export const ROLES_GET_ALL = [Role.Admin, Role.SU];

export const TASK_API_TAG = 'Task';
export const TASK_PREFIX = 'task';
export const ACCESS_TOKEN_TYPE = AuthConstants.ACCESS_TOKEN_TYPE;