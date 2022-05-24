import {Controller, Param, Post, UseGuards} from '@nestjs/common';
import {AuthService} from './auth.service';
import {JwtAuthGuard} from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @UseGuards(JwtAuthGuard)
    @Post('confirm-link')
    async VerifyConfirmMailLink(@Param('link') link: string) {
        const user = await this.authService.VerifyConfirmMailLink(link)
        if (user) {
            return {message: "User is Activated", status: true}
        }
    }
}
