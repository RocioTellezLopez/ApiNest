import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({
    example: {
      _id: '64f1c2d8e73f2a8a91b7c8c9',
      email: 'user-prueba@inmobiliaria.com',
      rol: 'clientFinal',
      stateUser: 'active',
      phoneNumber: 1234567890,
      isBloqued: false,
      notification: ['64f1c2d8e73f2a8a91b7c8c9'],
      isVerified: true,
      lastLoginIn: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    description: 'Basic user information returned after successful login',
  })
  user: {
    _id: string;
    email: string;
    rol: string;
    stateUser: string;
    phoneNumber: number;
    isBloqued: boolean;
    notification?: string[];
    isVerified?: boolean;
    lastLoginIn?: Date;
    createdAt?: Date;
    updatedAt?: Date;
  };

  @ApiProperty({
    example: {
      _id: '64f1c2d8e73f2a8a91b7c8c9',
      userId: '64f1c2d8e73f2a8a91b7c8c9',
      fullName: 'Admin',
      favorites: ['64f1c2d8e73f2a8a91b7c8c9'],
      lastProperties: ['64f1c2d8e73f2a8a91b7c8c9'],
      acceptTerms: {
        termId: '64f1c2d8e73f2a8a91b7c8c9',
        acceptedAt: new Date(),
      },
      reasonBlocked: [],
      roleHistory: [],
      isActiveRole: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  })
  perfil: {
    _id: string;
    userId: string;
    fullName: string;
    favorites: string[];
    lastProperties: string[];
    acceptTerms: { termId: string; acceptedAt: Date };
    reasonBlocked?: string[];
    roleHistory?: string[];
    isActiveRole?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  };
}

export class LoginResponseDto extends AuthResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token signed with RS256',
  })
  access_token: string;
}
