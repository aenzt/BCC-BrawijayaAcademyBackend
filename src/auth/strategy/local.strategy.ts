import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({usernameField: 'nim'});
  }

  async validate(nim: number, password: string): Promise<any> {
    const user = await this.authService.validateUser(nim, password);
    if (!user) {
      throw new HttpException('NIM / Password is incorrect', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
}