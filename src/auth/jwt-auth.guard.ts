import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  OnModuleInit,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ModuleRef } from '@nestjs/core';
import { AuthService } from './auth.service';
import { firstValueFrom, isObservable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements OnModuleInit {
  private authService: AuthService;

  constructor(private readonly moduleRef: ModuleRef) {
    super();
  }

  async onModuleInit() {
    try {
      // Evita error de contexto con { strict: false }
      this.authService = await this.moduleRef.resolve(AuthService, undefined, { strict: false });
    } catch (error) {
      console.error('Error al resolver AuthService en JwtAuthGuard:', error);
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const result = super.canActivate(context);

    if (isObservable(result)) {
      return await firstValueFrom(result);
    }

    return result instanceof Promise ? await result : result;
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new UnauthorizedException('Token no proporcionado.');
    }

    if (this.authService?.isTokenBlacklisted?.(token)) {
      throw new UnauthorizedException('Token invalidado.');
    }

    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    return user;
  }
}

