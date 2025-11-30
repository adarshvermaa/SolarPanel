export class CreateApplicationDto {
    schemeId: number;
    documents?: Record<string, any>;
    notes?: string;
}
