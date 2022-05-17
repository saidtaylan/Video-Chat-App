import { Controller, Post, Param, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    @Post('login')
    async login(
      @Body() body: LoginDto) {
      return await this.authService.login(body.email, body.password);
    }
    @UseGuards(JwtAuthGuard)
    @Post('confirm-link')
    async VerifyConfirmMailLink(@Param('link') link: string) {
      const user =await this.authService.VerifyConfirmMailLink(link)
      if(user) {
        return {message: "User is Activated", status: true}
      }
    }
}
