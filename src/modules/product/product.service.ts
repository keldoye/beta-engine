import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BaseVOService } from "src/data/base-vo/base-vo.service";
import { Product } from "./product.entity";
import { ProductDetail } from "./product-detail.entity";

@Injectable()
export class ProductService {
  private voService: BaseVOService;

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductDetail)
    private readonly productDetailRepository: Repository<ProductDetail>
  ) {
    this.voService = BaseVOService.getInstance();
  }

  async create(product: Product, createdByUserId: string): Promise<Product> {
    if (product.productDetails.length === 0) {
      throw new BadRequestException(
        "Product must have at least one product detail"
      );
    }
    this.voService.handleBaseVOCreation(product, createdByUserId);

    product.productDetails.forEach((productDetail) => {
      this.voService.handleBaseVOCreation(productDetail, createdByUserId);
    });

    return await this.productRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find({
      relations: ["productDetails"],
    });
  }

  async findById(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ["productDetails"],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }

    return product;
  }

  async update(
    id: string,
    product: Product,
    updatedByUserId: string
  ): Promise<Product> {
    this.voService.handleBaseVOUpdate(product, updatedByUserId);
    await this.productRepository.save(product);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    const product = await this.findById(id);

    if (product.productDetails && product.productDetails.length > 0) {
      await this.productDetailRepository.remove(product.productDetails);
    }

    await this.productRepository.remove(product);
  }
}
