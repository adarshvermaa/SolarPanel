
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCalculatorConfigDto {
    @IsString()
    @IsNotEmpty()
    stateName: string;

    @IsNumber()
    @IsNotEmpty()
    avgSunlightHours: number;

    @IsNumber()
    @IsNotEmpty()
    costPerKw: number;

    @IsNumber()
    @IsNotEmpty()
    electricityRate: number;

    @IsNumber()
    @IsOptional()
    efficiencyPanel?: number;

    @IsNumber()
    @IsOptional()
    co2SavingsPerUnit?: number;
}

export class UpdateCalculatorConfigDto {
    @IsString()
    @IsOptional()
    stateName?: string;

    @IsNumber()
    @IsOptional()
    avgSunlightHours?: number;

    @IsNumber()
    @IsOptional()
    costPerKw?: number;

    @IsNumber()
    @IsOptional()
    electricityRate?: number;

    @IsNumber()
    @IsOptional()
    efficiencyPanel?: number;

    @IsNumber()
    @IsOptional()
    co2SavingsPerUnit?: number;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
