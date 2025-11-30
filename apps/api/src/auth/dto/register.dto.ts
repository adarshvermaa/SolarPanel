import { roleEnum } from '../../db/schema';

export class RegisterDto {
    email: string;
    password: string;
    fullName?: string;
    role?: 'user' | 'installer'; // Admin should be seeded or protected
}
