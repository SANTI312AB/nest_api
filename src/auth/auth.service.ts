import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

  private blacklistedTokens = new Set<string>();

  constructor(
    private usuariosService: UsuariosService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usuariosService.findByEmail(email);
    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;

    // Devuelve el usuario sin la contraseña
    const { password: _, ...result } = user;
    return result;
  }

  async validateUserById(userId: number): Promise<any> {
    const user = await this.usuariosService.findOne(userId);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Usuario inactivo o no encontrado');
    }
    return user;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    const token = await this.jwtService.signAsync(payload);

    return {
      token: token
    };
  }

  async logout(token: string) {
    if (!token) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    if (this.blacklistedTokens.has(token)) {
      throw new UnauthorizedException('Token ya fue invalidado');
    }

    this.blacklistedTokens.add(token);
    return { message: 'Sesión cerrada correctamente' };
  }

  isTokenBlacklisted(token: string): boolean {
    return this.blacklistedTokens.has(token);
  }
}
