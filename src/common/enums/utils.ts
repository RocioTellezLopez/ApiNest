import { AdminEnum } from '../../common/enums/admin-operation.enum';
import { TypeAdminEnum } from '../../common/enums/typeAdmin.enum';

// Mapeo de permisos según tipoAdmin
export const permissionsByTypeAdmin: Record<TypeAdminEnum, AdminEnum[]> = {
  [TypeAdminEnum.MAIN]: [
    AdminEnum.CREATEUSER,
    AdminEnum.UPDATEUSER,
    AdminEnum.USERBLOKER,
    AdminEnum.INACTIVEUSER,
    AdminEnum.READMETRICS,
    AdminEnum.READUSER,
  ],
  [TypeAdminEnum.AGENTS]: [AdminEnum.READUSER],
};
