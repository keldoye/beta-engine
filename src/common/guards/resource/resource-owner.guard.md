# Resource Owner Guard

The `ResourceOwnerGuard` is a powerful guard that ensures users can only access resources they own, with flexible role-based exceptions. This guard works in conjunction with the `@Resource` and `@RequireOwnership` decorators - for detailed information about these decorators and their configuration options, see [Resource Access Decorators](./decorators/resource.decorator.md).

## Features

- Automatic resource ownership verification with type safety
- Role-based access whitelist
- Configurable owner ID field
- Dynamic service injection
- Custom ownership check functions with proper typing

## Usage

### Basic Setup

1. First, configure the resource at the controller level using `@Resource`. See [Resource Access Decorators](./decorators/resource.decorator.md#resource-decorator) for all available configuration options:

```typescript
@Controller("customers")
@UseGuards(ResourceOwnerGuard)
@Resource<Customer>({
	resourceName: C.CUSTOMER_API_TAG,
	ownerIdField: C.ID,
	service: CustomerService,
	// Type-safe ownership check
	checkOwnership: (customer: Customer, user: JwtPayload) => {
		return customer.id === user.sub;
	},
})
export class CustomerController {
	// ...
}
```

2. Then, protect your endpoints using `@RequireOwnership`:

```typescript
@Get(':id')
@RequireOwnership()
async getCustomer(@Param('id') id: string): Promise<CustomerResponseDTO> {
	return this.customerService.findOne(id);
}
```

### Role Whitelist

You can specify roles that bypass the ownership check:

```typescript
@Put(':id')
@RequireOwnership(C.ROLES_REQUIRE_OWNERSHIP_WHITELIST)
async updateCustomer(
	@Param('id') id: string,
	@Body() updateDto: UpdateCustomerDto
): Promise<CustomerResponseDTO> {
	return this.customerService.update(id, updateDto);
}
```

### Custom Ownership Check

For complex ownership scenarios, you can provide a custom check function with proper typing:

```typescript
@Controller("users")
@Resource<User>({
	resourceName: C.USER_API_TAG,
	service: UserService,
	checkOwnership: async (user: User, authUser: JwtPayload) => {
		// Admin can access any user
		if (authUser.role === Role.Admin) return true;

		// Users can only access their own data
		return user.id === authUser.sub;
	},
})
export class UserController {
	// ...
}
```

## How It Works

1. When a request hits a protected endpoint, the guard:

    - Retrieves the resource metadata from `@Resource`
    - Checks for `@RequireOwnership` configuration
    - Gets the resource ID from request parameters

2. If the user has a whitelisted role, access is immediately granted

3. Otherwise, the guard:

    - Fetches the resource using the provided service
    - Verifies ownership using either:
        - The default owner ID field comparison
        - The custom ownership check function with proper typing

4. If ownership verification fails, throws a `ForbiddenException`

## Error Handling

The guard handles several error cases:

- `NotFoundException`: When the resource doesn't exist
- `ForbiddenException`: When the user doesn't own the resource
- Returns `false` for other unexpected errors

## Best Practices

1. Always use generic type parameters for type safety
2. Use constants for owner ID fields and role whitelists
3. Keep ownership check functions simple and focused
4. Consider using custom ownership checks for complex relationships
5. Document role whitelists in your API documentation

## Type Safety Examples

### Basic Entity Type

```typescript
@Resource<Customer>({
	resourceName: C.CUSTOMER_API_TAG,
	ownerIdField: C.ID,
	service: CustomerService
})
```

### With Custom Check

```typescript
@Resource<User>({
	resourceName: C.USER_API_TAG,
	service: UserService,
	checkOwnership: (user: User, authUser: JwtPayload) => {
		return user.id === authUser.sub;
	}
})
```
