import {forwardRef, HttpException, HttpStatus, Inject, Injectable,} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {InjectModel} from '@nestjs/mongoose';
import {User} from 'src/user/entities/user.entity';
import {UserService} from 'src/user/user.service';
import {Model} from 'mongoose';
import {sendMail} from 'src/helpers/sendMail';
import {ConfirmToken} from './entities/accountConfirmToken.interface';
import {AES, enc} from "crypto-js"
import {UserModel} from "../user/user.model";
import { nanoid } from 'nanoid';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        @InjectModel('user') private userEntity: Model<User>,
        @InjectModel('confirm-token')
        private TokenModel: Model<ConfirmToken>,
        @Inject(forwardRef(() => UserService)) private userService: UserService,
        @Inject(forwardRef(() => UserModel)) private userModel: UserModel
    ) {
    }

    generateJWT(user: { id: string; email: string; role: string, onlineId: string }): string {
        return this.jwtService.sign(user);
    }
    async isAlreadyExist(email: string): Promise<boolean> {
        const user = await this.userModel.findOne({email});
        return !!user;

    }

    encrypt(data: {} | string) {
        return AES.encrypt(JSON.stringify(data), process.env.PASSCODE_ENCRYPT_SECRET).toString()
    }

    decrypt(data: string) {
        const plainBytes = AES.decrypt(data, process.env.PASSCODE_ENCRYPT_SECRET)
        return JSON.parse(plainBytes.toString(enc.Utf8));
    }

    async validateUser(email: string, password: string) {
        const candidateUser: any = await this.userModel.findOne({email})
        if (candidateUser) {
            const isCredentialsTrue = password === candidateUser.password
            if (isCredentialsTrue) {
                return candidateUser;
            }
            throw new HttpException('credentials are wrong', HttpStatus.BAD_REQUEST);
        }
        throw new HttpException('credentials are wrong', HttpStatus.BAD_REQUEST);
    }

    async sendConfirmEmail(email: string, id: string) {
        const confirmationToken = nanoid()
        await this.TokenModel.insertMany({
            userId: id,
            token: confirmationToken,
        });
        const mailContent = `<h3> Aramıza Hoşgeldiniz.<br> Bize katılmak için yapmanız gereken tek ve son şey aşağıdaki linke tıklamak :)<br> <span><a>${process.env.BASE_URL}/user/verify/${confirmationToken}</a></span>`;
        await sendMail(
            process.env.EMAIL_FROM,
            [email],
            'Account Confirmation Link',
            mailContent,
            undefined,
        );
    }

    async VerifyConfirmMailLink(link: string) {
        const token = link.split('/verify/')[1];
        const isTokenExist = await this.TokenModel.find({token}).lean()
        if (isTokenExist.length > 0) {
            const user = await this.userEntity.findByIdAndUpdate(isTokenExist[0].userId, {status: 'Active'})
            await this.TokenModel.findByIdAndDelete(isTokenExist[0]._id)
            return user
        }
        throw new HttpException("confirmation link is invalid", HttpStatus.BAD_REQUEST)
    }
}
