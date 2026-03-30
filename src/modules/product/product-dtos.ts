import { ApiProperty, PartialType } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { ArrayMinSize, IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";
import { BaseVOResponseDTO } from "src/data/base-vo/base-vo.dto";

export class CreateProductDetailDTO {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    pricePerUnit: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    moq: number;
}
export class CreateProductDTO {
    @ApiProperty()
    @IsString()
    @IsNotEmpty() 
    name: string;

    @ApiProperty({type: [CreateProductDetailDTO]})
    @IsNotEmpty()
    @ArrayMinSize(1, { message: 'The list must contain at least one element' })
    @ValidateNested()
    @Type(() => CreateProductDetailDTO)
    productDetails: CreateProductDetailDTO[];
}

export class UpdateProductDTO extends PartialType(CreateProductDTO) {}

@Expose()
export class ProductDetailResponseDTO extends BaseVOResponseDTO {
    @Expose()
    description: string; 

    @Expose()
    pricePerUnit: number;

    @Expose()
    moq: number 
}
@Expose()
export class ProductResponseDTO extends BaseVOResponseDTO {
    @Expose()
    name: string;

    @Expose()
    @ApiProperty({
         type: [ProductDetailResponseDTO] 
    })
    productDetails: CreateProductDetailDTO[]
}



export class UpdateProductDetailDTO extends PartialType(CreateProductDetailDTO) {}



