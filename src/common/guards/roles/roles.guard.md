# Role-Based Access Control (RBAC)

This module implements role-based access control through the `RolesGuard` and `@Roles` decorator.

## Features

- Role-based access control at controller and method levels
- Support for multiple roles per endpoint
- Flexible role verification
- Integration with JWT authentication
- Hierarchical role support

## Usage

### @Roles Decorator

The `@Roles` decorator marks endpoints or controllers with the roles required to access them:

```typescript
@Roles(...roles: Role[])
```

### Basic Setup

1. Ensure your JWT payload contains the user's role:

```typescript
// auth.service.ts
@Injectable()
export class AuthService {
	async signIn(user: User): Promise<string> {
		const payload: JwtPayload = {
			sub: user.id,
			username: user.username,
			role: user.role, // Important: Include the role
		};
		return this.jwtService.sign(payload);
	}
}
```

2. Apply the guard at the controller level:

```typescript
@Controller("customers")
@UseGuards(JwtAuthGuard, RolesGuard)
export class CustomerController {
	// ...
}
```

### Access Control Examples

#### Controller-Level Access

```typescript
@Controller("customers")
@Roles(Role.Admin) // All endpoints require Admin role
export class CustomerController {
	// ...
}
```

#### Method-Level Access

```typescript
@Controller("customers")
export class CustomerController {
	// Public endpoint (no @Roles decorator)
	@Get("public-info")
	getPublicInfo() {
		// Accessible to all users
	}

	// Admin/SU only operations
	@Get()
	@Roles(Role.Admin, Role.SU)
	findAll() {
		// List all customers
	}

	// Sensitive operations (Admin/SU only)
	@Put(":id/archive")
	@Roles(Role.Admin, Role.SU)
	archive(@Param("id") id: string) {
		// Archive customer
	}
}
```

## How It Works

The guard performs role verification in three steps:

1. Extracts the user's role from the JWT payload
2. Retrieves the required roles from `@Roles` metadata
3. Verifies if the user's role matches any of the required roles

```typescript
// Inside RolesGuard
canActivate(context: ExecutionContext): boolean {
	const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
		context.getHandler(),
		context.getClass()
	]);

	if (!requiredRoles) {
		return true; // No roles required
	}

	const { user } = context.switchToHttp().getRequest();
	return requiredRoles.some((role) => user.role === role);
}
```

## Error Handling

The guard handles several cases:

- Returns `true` if no roles are required
- Returns `true` if user's role matches any required role
- Throws `ForbiddenException` if user's role doesn't match any required role

## Best Practices

### 1. Use Role Enums

```typescript
export enum Role {
	Admin = "Admin",
	SU = "SU",
	User = "User",
}
```
