import { BaseVO } from "src/data/base-vo/base-vo.abstract";
import { Entity, Column, OneToMany } from 'typeorm';
import { ProductDetail } from "./product-detail.entity";

@Entity()
export class Product extends BaseVO {
    @Column()
    name: string;

    @OneToMany(() => ProductDetail, (detail) => detail.product , { cascade: true })
    productDetails: ProductDetail[];
}