import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        try {
            const user = await this.usersService.findByEmail(email);
            if (!user) {
                return null;
            }

            const isPasswordValid = await bcrypt.compare(pass, user.passwordHash);
            if (!isPasswordValid) {
                return null;
            }

            const { passwordHash, ...result } = user;
            return result;
        } catch (error) {
            console.error('Error validating user:', error);
            return null;
        }
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
            }
        };
    }

    async register(registerDto: RegisterDto) {
        try {
            // Check if user exists
            const existing = await this.usersService.findByEmail(registerDto.email);
            if (existing) {
                throw new ConflictException('An account with this email already exists');
            }

            // Validate password strength
            if (registerDto.password.length < 6) {
                throw new BadRequestException('Password must be at least 6 characters long');
            }

            const hashedPassword = await bcrypt.hash(registerDto.password, 10);

            const newUser = await this.usersService.create({
                email: registerDto.email,
                passwordHash: hashedPassword,
                role: registerDto.role || 'user',
                fullName: registerDto.fullName,
                phone: registerDto.phone,
            });

            return this.login(newUser[0]);
        } catch (error) {
            // Rethrow known exceptions
            if (error instanceof ConflictException || error instanceof BadRequestException) {
                throw error;
            }
            // Handle unexpected errors
            console.error('Registration error:', error);
            throw new BadRequestException('Registration failed. Please try again.');
        }
    }
}
