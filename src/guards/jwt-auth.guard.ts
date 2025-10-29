import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import type { FastifyRequest } from 'fastify';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<FastifyRequest>();

    const auth = req.headers['authorization'];
    let token: string | undefined =
      auth?.startsWith('Bearer ') ? auth.slice(7) : undefined;

    if (!token) {
      const cookieName =
        this.config.get<string>('JWT_ACCESS_COOKIE') ?? 'access_token';

      const raw = (req.cookies?.[cookieName] as string | undefined) ?? undefined;
      if (raw) {
        if (typeof (req as any).unsignCookie === 'function') {
          const un = (req as any).unsignCookie(raw);
          if (!un.valid) throw new UnauthorizedException('Invalid cookie signature');
          token = un.value;
        } else {
          token = raw;
        }
      }
    }

    if (!token) throw new UnauthorizedException('No token');

    try {
      const secret = this.config.getOrThrow<string>('JWT_ACCESS_SECRET_KEY');
      const payload = await this.jwt.verifyAsync(token, { secret });

      (req as any).user = payload;
      return true;
    } catch (e: any) {
      if (e?.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token expired');
      }
      throw new ForbiddenException('Invalid token');
    }
  }
}
