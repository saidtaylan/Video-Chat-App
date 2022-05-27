import {Controller, Get} from '@nestjs/common';
import {UserService} from "./user/user.service";

@Controller()
export class AppController {
    constructor(private userService: UserService) {}
    @Get("enter-site")
    enterSite() {
        return this.userService.enterSite()
    }
}
