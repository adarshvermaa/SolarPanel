import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AssignAgentDto {
    @IsInt()
    @IsNotEmpty()
    applicationId: number;

    @IsInt()
    @IsNotEmpty()
    agentId: number;

    @IsString()
    @IsOptional()
    notes?: string;
}

export class UpdateInstallationStatusDto {
    @IsString()
    @IsNotEmpty()
    status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

    @IsString()
    @IsOptional()
    notes?: string;

    @IsOptional()
    photos?: any[];

    @IsString()
    @IsOptional()
    completionCertificate?: string;
}
