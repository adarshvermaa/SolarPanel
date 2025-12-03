import { IsEmail, IsString, MinLength, IsOptional, IsArray } from 'class-validator';

export class CreateAgentDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsString()
    fullName: string;

    @IsString()
    phone: string;

    @IsString()
    companyName: string;

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsArray()
    certifications?: string[];

    @IsOptional()
    @IsArray()
    serviceAreas?: string[];
}
