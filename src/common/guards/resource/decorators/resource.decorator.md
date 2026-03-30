# Resource Access Decorators

This module provides two powerful decorators for handling resource access control: `@Resource` and `@RequireOwnership`. For detailed information about how these decorators work with the guard system, see [Resource Owner Guard](../resource-owner.guard.md).

## @Resource Decorator

The `@Resource` decorator configures how a resource should be accessed and verified within a controller.

### Configuration Options

```typescript
export interface ResourceMetadata<T> {
	resourceName: string;
	ownerIdField?: string;
	service: Type<any>;
	checkOwnership?: (resource: T, user: JwtPayload) => boolean | Promise<boolean>;
}
```

### Examples

#### Basic Usage

```typescript
@Controller("customers")
@Resource<Customer>({
	resourceName: C.CUSTOMER_API_TAG,
	ownerIdField: "id",
	service: CustomerService,
})
export class CustomerController {
	// ...
}
```

#### With Custom Ownership Check

```typescript
@Controller("users")
@Resource<User>({
	resourceName: C.USER_API_TAG,
	service: UserService,
	checkOwnership: (user: User, authUser: JwtPayload) => {
		return user.id === authUser.sub || authUser.role === Role.Admin;
	},
})
export class UserController {
	// ...
}
```

## @RequireOwnership Decorator

The `@RequireOwnership` decorator marks endpoints that require ownership verification, with optional role-based bypasses.

### Syntax

```typescript
@RequireOwnership(roleWhitelist?: Role[])
```

### Examples

#### Basic Ownership Check

```typescript
@Get(':id')
@RequireOwnership()
async getCustomer(@Param('id') id: string): Promise<CustomerResponseDTO> {
	return this.customerService.findOne(id);
}
```

#### With Role Whitelist

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

## Best Practices

1. **Use Type Safety with Generics**

    ```typescript
    @Resource<Customer>({
    	resourceName: C.CUSTOMER_API_TAG,
    	ownerIdField: C.ID,
    	service: CustomerService,
    	checkOwnership: (customer: Customer, user: JwtPayload) => {
    		return customer.id === user.sub;
    	}
    })
    ```

2. **Use Constants**

    ```typescript
    // constants.ts
    export class CustomerConstants {
        // Swagger and Paths
        static readonly ID = 'id';
        // Authorized roles for each operation
        static readonly ROLES_REQUIRE_OWNERSHIP_WHITELIST = [Role.Admin, Role.SU]; // Whitelist for require ownership
    }


    @Get(`:${C.ID}`)
    @RequireOwnership(C.ROLES_REQUIRE_OWNERSHIP_WHITELIST)
    async update() {
    	// ...
    }
    ```

3. **Consistent Naming**
    ```typescript
    @Resource<User>({
    	resourceName: C.USER_API_TAG,
    	ownerIdField: C.ID,
    	service: UserService
    })
    ```

## Common Patterns

### Complex Ownership Rules

```typescript
@Controller('users')
@Resource<User>({
	resourceName: C.USER_API_TAG,
	service: UserService,
	checkOwnership: async (user: User, authUser: JwtPayload) => {
		// Admin can access any user
		if (authUser.role === Role.Admin) return true;

		// Users can only access their own data
		return user.id === authUser.sub;
	}
})
```
