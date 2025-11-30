import { IsNotEmpty, IsString, IsNumber, IsOptional, IsEmail, IsArray, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { applicationStatusEnum } from '../../db/schema';

export class CreateApplicationDto {
    @IsNotEmpty()
    @IsNumber()
    schemeId: number;

    @IsNotEmpty()
    @IsString()
    applicantName: string;

    @IsNotEmpty()
    @IsEmail()
    applicantEmail: string;

    @IsNotEmpty()
    @IsString()
    applicantPhone: string;

    @IsNotEmpty()
    @IsString()
    address: string;

    @IsNotEmpty()
    @IsString()
    city: string;

    @IsNotEmpty()
    @IsString()
    state: string;

    @IsNotEmpty()
    @IsString()
    pincode: string;

    @IsOptional()
    @IsString()
    propertyType?: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    roofArea?: number;

    @IsOptional()
    @IsString()
    roofType?: string;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    requestedCapacity: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    estimatedCost?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    estimatedSubsidy?: number;

    @IsOptional()
    @IsArray()
    documents?: any[];
}

export class UpdateApplicationStatusDto {
    @IsNotEmpty()
    @IsEnum(applicationStatusEnum.enumValues)
    status: (typeof applicationStatusEnum.enumValues)[number];

    @IsOptional()
    @IsString()
    rejectionReason?: string;

    @IsOptional()
    @IsString()
    reviewNotes?: string;
}
