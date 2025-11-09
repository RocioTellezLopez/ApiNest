import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { AdminService } from '../../admin/admin.service';

@Injectable()
export class InitService implements OnApplicationBootstrap {
  constructor(private readonly adminService: AdminService) {}

  async onApplicationBootstrap() {
    try {
      console.log(
        'Inicializando aplicación - Creando admin por defecto si no existe en la base de datos.',
      );

      await this.adminService.createMainAdminDefault();

      console.log('✅ Finalizó InitService');
    } catch (error) {
      console.error('Error creando admin por defecto:', error);
    }
  }
}
