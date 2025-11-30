import { IsNotEmpty, IsNumber, IsOptional, IsString, IsDateString, IsEnum, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { installationStatusEnum } from '../../db/schema';

export class CreateInstallationDto {
    @IsNotEmpty()
    @IsNumber()
    applicationId: number;

    @IsOptional()
    @IsNumber()
    installerId?: number;

    @IsOptional()
    @IsDateString()
    scheduledDate?: string;

    @IsOptional()
    @IsString()
    notes?: string;
}

export class UpdateInstallationDto {
    @IsOptional()
    @IsEnum(installationStatusEnum.enumValues)
    status?: (typeof installationStatusEnum.enumValues)[number];

    @IsOptional()
    @IsDateString()
    scheduledDate?: string;

    @IsOptional()
    @IsDateString()
    startDate?: string;

    @IsOptional()
    @IsDateString()
    completionDate?: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    actualCapacity?: number;

    @IsOptional()
    @IsNumber()
    panelCount?: number;

    @IsOptional()
    @IsString()
    panelType?: string;

    @IsOptional()
    @IsString()
    inverterType?: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    inverterCapacity?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    totalCost?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    subsidyApplied?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    finalCost?: number;

    @IsOptional()
    @IsArray()
    photos?: any[];

    @IsOptional()
    @IsString()
    completionCertificate?: string;

    @IsOptional()
    @IsString()
    warrantyDocument?: string;

    @IsOptional()
    @IsString()
    notes?: string;

    @IsOptional()
    @IsNumber()
    warrantyYears?: number;
}
