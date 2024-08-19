import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

export type JwtPayload = {
  email: string;
  sub: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      passReqToCallback: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async validate(payload: JwtPayload) {
    const user = await this.authService.verifyPayload(payload);

    if (!user) throw new UnauthorizedException('Please log in to continue');

    return user;
  }
}
