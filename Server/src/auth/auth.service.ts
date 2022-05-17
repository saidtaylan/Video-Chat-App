import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/models/user.model';
import { UserService } from 'src/user/user.service';
import { Model } from 'mongoose';
import { sendMail } from 'src/helpers/sendMail';
import { ConfirmToken } from './models/accountConfirmToken.model';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel('user') private UserModel: Model<User>,
    @InjectModel('confirm-token')
    private TokenModel: Model<ConfirmToken>,
    @Inject(forwardRef(() => UserService)) private userService: UserService,
  ) {}

  generateJWT(user: { id: string; email: string; role: string }): string {
    return this.jwtService.sign(user);
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
  }

  async comparePasswords(pass: string, hashedPass: string): Promise<boolean> {
    return await bcrypt.compare(pass, hashedPass);
  }

  async isAlreadyExist(email: string): Promise<boolean> {
    const user = await this.userService.getUser({ email });
    if (user.length > 0) return true;
    return false;
  }

  async validateUser(email: string, password: string) {
    const candidateUser = await this.UserModel.findOne({ email }).lean();
    if (candidateUser) {
      const user = { ...candidateUser };
      const isCredentialsTrue = await this.comparePasswords(
        password,
        user.password,
      );
      if (isCredentialsTrue) {
        return user;
      }
      throw new HttpException('credentials are wrong', HttpStatus.BAD_REQUEST);
    }
    throw new HttpException('credentials are wrong', HttpStatus.BAD_REQUEST);
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (user) {
      const accessToken = this.generateJWT({
        id: user._id.toHexString(),
        email: user.email,
        role: user.role,
      });
      return { accessToken, id: user._id.toString() };
    }
    throw new NotFoundException('User not found');
  }

  async sendConfirmEmail(email: string, id: string) {
    const confirmationToken = bcrypt.hash(email, 10)
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
    if(isTokenExist.length>0) {
      const user = await this.UserModel.findByIdAndUpdate(isTokenExist[0].userId, {status: 'Active'})
      await this.TokenModel.findByIdAndDelete(isTokenExist[0]._id)
      return user
    }
    throw new HttpException("confirmation link is invalid", HttpStatus.BAD_REQUEST)
  }
}
