import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import { AuthService } from './auth.service';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService,private readonly authService: AuthService) {
    
    const publicKeyPath = configService.get('JWT_PUBLIC_KEY_PATH');

     console.log('---[ DEBUG JWT STRATEGY ]---');
     console.log('Ruta de clave pública leída de .env:', publicKeyPath);

    if (!publicKeyPath) {
      throw new Error('JWT_PUBLIC_KEY_PATH no está definido en el archivo .env');
    }

    const publicKey = fs.readFileSync(publicKeyPath, 'utf8');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: publicKey,
      algorithms: [configService.get('JWT_ALGORITHM') || 'RS256'], // Asegúrate de que el algoritmo coincida con el que usas al firmar el token
    });
  }

  async validate(payload: any) {
    // Buscar el usuario por ID y verificar si está activo
    const user = await this.authService.validateUserById(payload.sub);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Usuario bloqueado.');
    }
    return {
      sub: Number(user.id),
      username: user.username,
    };
  }
  
}
