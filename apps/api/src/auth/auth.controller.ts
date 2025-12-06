import { Controller, Post, Body, UseGuards, Request, Get, UnauthorizedException, BadRequestException, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: LoginDto) {
        try {
            const user = await this.authService.validateUser(loginDto.email, loginDto.password);
            if (!user) {
                throw new UnauthorizedException('Invalid email or password');
            }
            return this.authService.login(user);
        } catch (error) {
            // If it's already an HTTP exception, rethrow it
            if (error instanceof UnauthorizedException || error instanceof BadRequestException) {
                throw error;
            }
            // Otherwise, throw a generic unauthorized error
            throw new UnauthorizedException('Login failed. Please check your credentials and try again.');
        }
    }

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() registerDto: RegisterDto) {
        try {
            // Validate required fields
            if (!registerDto.email || !registerDto.password || !registerDto.fullName) {
                throw new BadRequestException('Email, password, and full name are required');
            }

            return await this.authService.register(registerDto);
        } catch (error) {
            // If it's already an HTTP exception, rethrow it
            if (error instanceof UnauthorizedException || error instanceof BadRequestException) {
                throw error;
            }
            // Otherwise, throw a generic error
            throw new BadRequestException('Registration failed. Please try again.');
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('profile')
    getProfile(@Request() req: any) {
        return req.user;
    }
}
