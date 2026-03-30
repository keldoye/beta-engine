import { Injectable, NotFoundException } from "@nestjs/common";
import { Product } from "./product.entity";
import { BaseVOService } from "src/data/base-vo/base-vo.service";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductDetail } from "./product-detail.entity";

@Injectable()
export class ProductDetailService {
  private voService: BaseVOService;
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductDetail)
    private readonly productDetailRepository: Repository<ProductDetail>
  ) {
    this.voService = BaseVOService.getInstance();
  }

  async findById(id: string): Promise<ProductDetail> {
    const productDetail = await this.productDetailRepository.findOne({
      where: { id },
      relations: ["product"],
    });

    if (!productDetail) {
      throw new NotFoundException(`ProductDetail with ID "${id}" not found`);
    }

    return productDetail;
  }

  async create(productDetail: ProductDetail, createdByUserId: string) {
    this.voService.handleBaseVOCreation(productDetail, createdByUserId);
    return await this.productDetailRepository.save(productDetail);
  }

  async update(
    id: string,
    productDetail: ProductDetail,
    updatedByUserId: string
  ): Promise<ProductDetail> {
    this.voService.handleBaseVOUpdate(productDetail, updatedByUserId);
    await this.productDetailRepository.save(productDetail);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    const productDetail = await this.findById(id);
    await this.productDetailRepository.remove(productDetail);
  }
}
