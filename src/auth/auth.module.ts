import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';

import * as fs from 'fs';
import { UsuariosModule } from 'src/usuarios/usuarios.module';

@Module({
  imports: [
    PassportModule,
    ConfigModule,
    forwardRef(() => UsuariosModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const privateKeyPath = config.get<string>('JWT_PRIVATE_KEY_PATH');
        const publicKeyPath = config.get<string>('JWT_PUBLIC_KEY_PATH');

        if (!privateKeyPath || !publicKeyPath) {
          throw new Error(
            'JWT_PRIVATE_KEY_PATH y/o JWT_PUBLIC_KEY_PATH no están definidos en el archivo .env',
          );
        }

        const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
        const publicKey = fs.readFileSync(publicKeyPath, 'utf8');

        return {
          privateKey,
          publicKey,
          signOptions: {
            expiresIn: config.get('JWT_EXPIRATION') || '1h',
            algorithm: config.get('JWT_ALGORITHM') || 'RS256',
          },
        };
      },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService], // <-- 🔥 Esto permite usar AuthService en otros módulos y con ModuleRef
})
export class AuthModule {}
