import { BaseVO } from "src/data/base-vo/base-vo.abstract";
import { Entity, Column, ManyToOne } from "typeorm";
import { Product } from "./product.entity";

@Entity()
export class ProductDetail extends BaseVO {
  @Column()
  description: string;

  @Column()
  pricePerUnit: number;

  @Column()
  moq: number;

  @ManyToOne(() => Product, (product) => product.productDetails)
  product: Product;
}
