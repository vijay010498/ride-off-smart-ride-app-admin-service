import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as process from 'process';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';
type JwtPayload = {
  sub: string;
  email: string;
};
@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_SECRET,
      passReqToCallback: true,
    });
  }
  validate(req: Request, payload: JwtPayload) {
    const accessToken = req.get('Authorization').replace('Bearer', '').trim();
    return { ...payload, accessToken };
  }
}
