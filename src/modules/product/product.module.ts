import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./product.entity";
import { ProductDetail } from "./product-detail.entity";
import { RolesGuard } from "../../common/guards/roles/roles.guard";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { ProductDetailService } from "./product-detail.service";

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductDetail])],
  controllers: [ProductController],
  providers: [RolesGuard, ProductService, ProductDetailService],
  exports: [ProductService],
})
export class ProductModule {}
