import { Document, ObjectId, Schema } from 'mongoose';
import { rolEnum } from '../../common/enums/rol.enum';
import { stateUserEnum } from '../../common/enums/stateUser.enum';
import { TypeAdminEnum } from '../../common/enums/typeAdmin.enum';

/**
 * Interfaz que representa un usuario en la base de datos.
 * Extiende `Document` de Mongoose para incluir campos específicos del usuario.
 */
export interface IUser extends Document {
  /** Correo electrónico del usuario */
  email: string;

  /** Contraseña cifrada del usuario */
  password: string;

  /** Rol del usuario */
  rol: rolEnum;

  /** Tipo de admin, opcional */
  typeAdmin?: TypeAdminEnum;

  /** Referencia al documento Admin asociado, opcional */
  adminId?: Schema.Types.ObjectId;

  /** URL o path de la imagen de avatar, opcional */
  imgAvatar?: string;

  /** Estado actual del usuario */
  stateUser: stateUserEnum;

  /** Fecha de eliminación lógica, opcional */
  deleteAt?: Date;

  /** Número de teléfono del usuario */
  numberPhone: number;

  /** Indicador si el usuario está bloqueado, opcional */
  isBlocked?: boolean;

  /** Fecha del último inicio de sesión, opcional */
  lastLoginIn?: Date;

  /** Información sobre aceptación de términos */
  acceptTerms: {
    /** ID del término aceptado */
    termId: ObjectId;

    /** Fecha en que se aceptaron los términos */
    acceptedAt: Date;
  };

  /** Razones por las que el usuario fue bloqueado, opcional */
  reasonBlocked?: string[];

  /** Notificaciones asociadas al usuario, opcional */
  notification?: string[];
}
