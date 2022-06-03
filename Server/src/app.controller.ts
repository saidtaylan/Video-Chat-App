import {Body, Controller, Get, Post, Query, Req, UseGuards} from '@nestjs/common';
import {OptionalJWTGuard} from './auth/guards/optional-jwt.guard';
import {UserService} from "./user/user.service";
import {FastifyRequest} from "fastify";
import {JwtAuthGuard} from "./auth/guards/jwt.guard";

@Controller()
export class AppController {
    constructor(private userService: UserService) {
    }

    @Post("enter-site")
    enterSite(@Body() body: {} | { userId: string, onlineId: string }) {
        if ("userId" in body) return this.userService.enterSite(body.userId, body.onlineId)
        return this.userService.enterSite()
    }
}
