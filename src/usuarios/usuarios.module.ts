import { Module } from '@nestjs/common';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { ProfileController } from './profile.controller';

@Module({
    controllers: [UsuariosController, ProfileController],
    providers: [UsuariosService],
    exports: [UsuariosService] // Exportamos el servicio para que pueda ser utilizado en otros módulos
})
export class UsuariosModule {}
