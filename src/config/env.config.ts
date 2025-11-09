
export const EnvConfiguration = () => ({
  environment: process.env.NODE_ENV || 'dev',
  mongodb: process.env.MONGO_DB || 'mongodb://localhost:27017/InmPruebas',
  dbname: process.env.MONGO_DB_NAME || 'InmPruebas',
  port: process.env.PORT || 3000,
  emailAdmin: process.env.EMAIL_ADMIN || 'admin@inmobiliaria.com',
  passwordAdmin: process.env.PASSWORD_ADMIN || 'inmobiliaria@123',
  phoneNumberAdmin: +(process.env.PHONE_NUMBER_ADMIN || 1234567890),
  fullNameAdmin: process.env.FULL_NAME_ADMIN || 'Admin Inmobiliaria',
  termIdAdmin: process.env.TERM_ID_ADMIN || '000000000000000000000000',
});
