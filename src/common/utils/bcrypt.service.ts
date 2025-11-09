import * as bcrypt from 'bcrypt';
export class BcryptService {
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(password, salt);
    return newPassword;
  }

  async comparePassword(password: string, hashPassword: string): Promise<boolean> {
    const matchPassword = await bcrypt.compare(password, hashPassword);
    return matchPassword;
  }

}