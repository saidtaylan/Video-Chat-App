import {Controller, Get, Query} from '@nestjs/common';
import {UserService} from "./user/user.service";

@Controller()
export class AppController {
    constructor(private userService: UserService) {}
    @Get("enter-site")
    enterSite(@Query('id') id?: string) {
        if(id) return this.userService.enterSite(id)
        return this.userService.enterSite()
    }
}
