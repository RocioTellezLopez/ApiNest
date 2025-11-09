import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/user.service';
import { AdminService } from '../../admin/admin.service';
import { Admin } from '../../admin/entities/admin.entity';
import { User } from '../../user/entities/user.entity';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Middleware que intercepta la solicitud y extrae el usuario autenticado a partir del token JWT.
 * Si el token es válido, agrega el usuario (User o Admin) a `req.currentUser`.
 */
@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  private readonly jwtService: JwtService;

  /**
   * Inicializa el middleware con los servicios necesarios.
   * @param userService Servicio de usuarios
   * @param adminService Servicio de administradores (actualmente no se usa directamente)
   */
  constructor(
    private readonly userService: UserService,
    private readonly adminService: AdminService,
  ) {
    this.jwtService = new JwtService({
      publicKey: fs.readFileSync(path.resolve('keys/public.pem')),
    });
  }

  /**
   * Intercepta cada solicitud entrante, verifica el JWT y agrega el usuario autenticado al objeto `req`.
   *
   * @param req Objeto de solicitud HTTP
   * @param res Objeto de respuesta HTTP
   * @param next Función para continuar con el flujo de middleware
   *
   * @throws UnauthorizedException Si el token es inválido o el usuario no existe
   */
  async use(req: any, res: any, next: () => void) {
    const authHeader = req.headers.authorization;

    // Si no hay token, continuar sin establecer currentUser
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.replace('Bearer ', '');

    try {
      // Verifica el token JWT usando la clave pública y algoritmo RS256
      const payload = await this.jwtService.verifyAsync(token, {
        algorithms: ['RS256'],
      });

      // Busca el usuario por el ID (`sub`) del payload
      let currentUser: Admin | User = await this.userService.findById(payload.sub);

      if (!currentUser) {
        currentUser = await this.userService.findById(payload.sub);
      }

      if (!currentUser) {
        throw new UnauthorizedException('Usuario no encontrado');
      }

      // Establece el usuario actual en el objeto de solicitud
      req.currentUser = currentUser;
      next();
    } catch (error) {
      console.error('JWT verification error:', error);
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}
