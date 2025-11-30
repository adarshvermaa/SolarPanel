import { IsNotEmpty, IsString, IsOptional, IsNumber, IsBoolean, IsArray, IsObject, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSchemeDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsOptional()
    @IsString()
    shortDescription?: string;

    @IsOptional()
    @IsObject()
    eligibilityCriteria?: Record<string, any>;

    @IsOptional()
    @IsString()
    benefits?: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    subsidyPercentage?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    maxSubsidyAmount?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    minCapacity?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    maxCapacity?: number;

    @IsOptional()
    @IsString()
    coverImage?: string;

    @IsOptional()
    @IsArray()
    documents?: any[];

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

export class UpdateSchemeDto extends CreateSchemeDto { }
