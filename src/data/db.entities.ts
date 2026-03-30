import { Address } from 'src/modules/address/address.entity';
import { Customer } from 'src/modules/persons/customer/customer.entity';
import { User } from 'src/modules/persons/user/user.entity';
import { Task } from 'src/modules/task/task.entity';
import { Product } from "src/modules/product/product.entity";
import { ProductDetail } from "src/modules/product/product-detail.entity";
//Add the db tables in the object below
export const DatabaseEntities = {
	User,
	Customer,
	Address,
	Task,
  Product,
  ProductDetail
};
