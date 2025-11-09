import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { rolEnum } from '../../common/enums/rol.enum';
import { stateUserEnum } from '../../common/enums/stateUser.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Schema({ timestamps: true })
export class User extends Document {
  @ApiProperty({
    example: 'user-prueba',
    description: 'Nombres y Apellidos del usuario',
  })
  @Prop({
    type: String,
    required: true,
    unique: false,
  })
  fullName: string;

  @ApiProperty({
    example: 'user-prueba@inmobiliaria.com',
    description: 'Email del usuario',
  })
  @Prop({
    type: String,
    required: true,
    unique: true,
    index: true,
  })
  email: string;

  @ApiProperty({
    example: '*********@123',
    description: 'Contraseña del usuario (mínimo 6 caracteres)',
  })
  @Prop({
    type: String,
    required: true,
    select: false,
  })
  password: string;

  @ApiProperty({
    example: '123456789',
    description: 'Numero de telefono del usuario',
  })
  @Prop({
    type: Number,
    required: true,
    unique: true,
  })
  phoneNumber: number;

  @ApiProperty({
    example: 'CLIENTFINAL',
    description: 'Rol del usuario por default (ClientFinal)',
  })
  @Prop({
    type: String,
    enum: rolEnum,
    default: rolEnum.CLIENTFINAL,
  })
  rol?: rolEnum;

  @ApiPropertyOptional({
    example: 'https://miweb.com/avatar.jpg',
    description: 'URL del avatar del usuario',
  })
  @Prop({
    type: String,
    index: true,
    default: null,
  })
  imgAvatar?: string;

  @ApiPropertyOptional({
    example: 'active',
    description: 'Estado del usuario',
  })
  @Prop({
    type: String,
    enum: stateUserEnum,
    default: stateUserEnum.ACTIVE,
  })
  stateUser?: stateUserEnum; // revisar para manejar el estado de bloqueo del usuario

  @ApiPropertyOptional({
    example: '2022-07-01T00:00:00.000Z',
    description: 'Fecha de eliminación del usuario',
  })
  @Prop({
    type: Date,
    default: null,
  })
  deleteAt?: Date;

  @ApiPropertyOptional({
    example: 'false',
    description: 'Indica si el usuario ha sido bloqueado',
  })
  @Prop({
    type: Boolean,
    default: false,
  })
  isBlocked?: boolean;

  @ApiPropertyOptional({
    example: ['Razón 1', 'Razón 2'],
    description: 'Array de razones por las cuales el usuario fue bloqueado',
  })
  @Prop({
    type: [String],
    default: [],
  })
  reasonBlocked?: string[];

  @ApiPropertyOptional({
    example: '2022-07-01T00:00:00.000Z',
    description: 'Fecha de la ultima vez que el usuario ha iniciado sesion',
  })
  @Prop({
    type: Date,
    default: Date.now,
    index: true,
  })
  lastLoginIn?: Date;

  @ApiProperty({
    example: ['mongo-id-terms-0001', 'mongo-id-terms-0002'],
    description: 'Array de términos y condiciones aceptados',
  })
  @Prop({
    type: [
      {
        termId: {
          type: Types.ObjectId,
          ref: 'TermsConditions',
          required: true,
        },
        acceptedAt: { type: Date, required: false, default: Date.now },
      },
    ],
    required: true,
    default: [],
  })
  acceptTerms: {
    termId: Types.ObjectId;
    acceptedAt: Date;
  }[];

  @ApiPropertyOptional({
    example: '["mongo-id-notification-0001", "mongo-id-notification-0002"]',
    description: 'Array de IDs de notificaciones (MongoID)',
  })
  @Prop({
    type: [String],
    default: [],
  })
  notification?: string[];

  @ApiPropertyOptional({
    example: ['mongo-id-favorite-0001', 'mongo-id-favorite-0002'],
    description: 'Array de IDs de favoritos (MongoID)',
  })
  @Prop({
    type: [Types.ObjectId],
    ref: 'Favorite',
    default: [],
  })
  favorites?: Types.ObjectId[];

  @ApiPropertyOptional({
    example: 'false',
    description: 'Indica si el correo ha sido verificado',
  })
  @Prop({
    type: Boolean,
    default: false,
  })
  isVerified?: boolean; //agregar para verificar el correo

  @ApiPropertyOptional({
    example: 'mongo-id-role-history-0001',
    description: 'ID del historial de roles (MongoID)',
  })
  @Prop({
    type: Types.ObjectId,
    ref: 'RoleHistory',
    default: null,
  })
  historyRoleChangeId?: Types.ObjectId;

  @ApiPropertyOptional({
    example: 'cus_1234567890abcdef',
    description: 'ID del cliente en Stripe',
  })
  @Prop({
    type: String,
    index: true,
    default: null,
  })
  customerId?: string; // ID del cliente en Stripe
}

export const UserSchema = SchemaFactory.createForClass(User);
