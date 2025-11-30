import { Injectable, UnauthorizedException } from '@nestjs/common';
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
        const user = await this.usersService.findByEmail(email);
        if (user && (await bcrypt.compare(pass, user.passwordHash))) {
            const { passwordHash, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            // refresh_token logic can be added here
        };
    }

    async register(registerDto: RegisterDto) {
        // Check if user exists
        const existing = await this.usersService.findByEmail(registerDto.email);
        if (existing) {
            throw new UnauthorizedException('User already exists');
        }
        const newUser = await this.usersService.create({
            email: registerDto.email,
            passwordHash: registerDto.password, // Will be hashed in UsersService
            role: registerDto.role || 'user',
            fullName: registerDto.fullName,
        });
        return this.login(newUser[0]);
    }
}
