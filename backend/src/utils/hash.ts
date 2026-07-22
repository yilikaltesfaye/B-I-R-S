import bcrypt from "bcryptjs";

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};
export const comparePasswords = (plain: string, hashed: string) =>
  bcrypt.compare(plain, hashed);
