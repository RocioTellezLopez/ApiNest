import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class AppService implements OnModuleInit {
  constructor() {}

  async onModuleInit() {
    console.log(
      'Inicializando aplicación - Creando admin por defecto si no existe...',
    );
    try {
    } catch (error) {
      console.error('Error creando admin por defecto:', error);
    }
  }
}
