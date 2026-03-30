import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Post,
  Put,
  Request,
} from "@nestjs/common";
import { ProductService } from "./product.service";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import {
  CreateProductDetailDTO,
  CreateProductDTO,
  ProductResponseDTO,
  UpdateProductDTO,
  UpdateProductDetailDTO,
} from "./product-dtos";
import { plainToInstance } from "class-transformer";
import { Product } from "./product.entity";
import { UUIDParam } from "src/common/decorators/uuid-param.decorator";
import { ProductDetailService } from "./product-detail.service";
import { ProductDetail } from "./product-detail.entity";

@Controller("product")
@ApiBearerAuth("access-token")
@ApiTags("Product")
export class ProductController {
  constructor(
    private productService: ProductService,
    private productDetailService: ProductDetailService
  ) {}

  @Get()
  @ApiOperation({ summary: "Get all products" })
  @ApiResponse({
    status: 200,
    description: "Returns all products",
    type: [ProductResponseDTO],
  })
  async findAll(): Promise<ProductResponseDTO[]> {
    const products = await this.productService.findAll();
    return products.map((product) =>
      plainToInstance(ProductResponseDTO, product)
    );
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a product by ID" })
  @ApiResponse({
    status: 200,
    description: "Returns the product",
    type: ProductResponseDTO,
  })
  async findOne(@UUIDParam("id") id: string): Promise<ProductResponseDTO> {
    const product = await this.productService.findById(id);
    return plainToInstance(ProductResponseDTO, product);
  }

  @Post()
  @ApiOperation({ summary: "Create a new product" })
  @ApiResponse({
    status: 201,
    description: "Product successfully created",
    type: ProductResponseDTO,
  })
  async createProduct(
    @Body() createProductDTO: CreateProductDTO,
    @Request() req
  ) {
    const product = plainToInstance(Product, createProductDTO);
    if (product.productDetails.length === 0) {
      throw new BadRequestException(
        "Product must have at least one product detail"
      );
    }

    return await this.productService.create(product, req.user.sub);
  }

  @Put(":id")
  @ApiOperation({ summary: "Update a product" })
  @ApiResponse({
    status: 200,
    description: "Product successfully updated",
    type: ProductResponseDTO,
  })
  async updateProduct(
    @UUIDParam("id") id: string,
    @Body() updateProductDTO: UpdateProductDTO,
    @Request() req
  ): Promise<ProductResponseDTO> {
    const targetProduct = await this.productService.findById(id);

    if (!targetProduct) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    Object.assign(targetProduct, updateProductDTO);

    const updatedProduct = await this.productService.update(
      id,
      targetProduct,
      req.user.sub
    );

    return plainToInstance(ProductResponseDTO, updatedProduct);
  }

  @Post(":id/product-detail")
  @ApiOperation({ summary: "Create a product detail for a product" })
  @ApiResponse({
    status: 201,
    description: "Product detail successfully created",
    type: ProductResponseDTO,
  })
  async createProductDetail(
    @UUIDParam("id") id: string,
    @Body() createProductDetailDTO: CreateProductDetailDTO,
    @Request() req
  ): Promise<ProductResponseDTO> {
    const product = await this.productService.findById(id);

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    const productDetail = plainToInstance(
      ProductDetail,
      createProductDetailDTO
    );
    productDetail.product = product;

    await this.productDetailService.create(productDetail, req.user.sub);

    return plainToInstance(
      ProductResponseDTO,
      await this.productService.findById(id)
    );
  }

  @Put(":id/product-detail/:detailId")
  @ApiOperation({ summary: "Update a product detail" })
  @ApiResponse({
    status: 200,
    description: "Product detail successfully updated",
    type: ProductResponseDTO,
  })
  async updateProductDetail(
    @UUIDParam("id") id: string,
    @UUIDParam("detailId") detailId: string,
    @Body() updateProductDetailDTO: UpdateProductDetailDTO,
    @Request() req
  ): Promise<ProductResponseDTO> {
    const product = await this.productService.findById(id);
    const targetProductDetail =
      await this.productDetailService.findById(detailId);

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    } else if (!targetProductDetail) {
      throw new NotFoundException(
        `Product detail with id ${detailId} not found`
      );
    } else if (targetProductDetail.product.id !== id) {
      throw new NotFoundException(
        `Product detail with id ${detailId} not found for product ${id}`
      );
    }

    Object.assign(targetProductDetail, updateProductDetailDTO);
    await this.productDetailService.update(
      detailId,
      targetProductDetail,
      req.user.sub
    );

    return plainToInstance(
      ProductResponseDTO,
      await this.productService.findById(id)
    );
  }

  @Delete(":id/product-detail/:detailId")
  @ApiOperation({ summary: "Delete a product detail by ID" })
  @ApiResponse({
    status: 200,
    description: "Product detail successfully deleted",
  })
  @ApiResponse({ status: 404, description: "Product detail not found" })
  async deleteProductDetail(
    @UUIDParam("id") productId: string,
    @UUIDParam("detailId") detailId: string
  ): Promise<ProductResponseDTO> {
    await this.productDetailService.delete(detailId);

    const updatedProduct = await this.productService.findById(productId);
    return plainToInstance(ProductResponseDTO, updatedProduct);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a product by ID" })
  @ApiResponse({
    status: 200,
    description: "Product successfully deleted",
    schema: { example: { message: "Product successfully deleted" } },
  })
  @ApiResponse({ status: 404, description: "Product not found" })
  async deleteProduct(
    @UUIDParam("id") id: string
  ): Promise<{ message: string }> {
    await this.productService.delete(id);
    return { message: "Product successfully deleted" };
  }
}
