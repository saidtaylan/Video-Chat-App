import {Injectable} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';

@Injectable()
export class OptionalJWTGuard extends AuthGuard('jwt') {
    handleRequest(
        err: any,
        user: any,
        info: any,
        context: any,
        status?: any,
    ) {
        return user;
    }
}
