import bcrypt from "bcryptjs";

export const hashValue = async (value: string, saltRound: number = 10) => {
  return await bcrypt.hash(value, saltRound);
};

export const compareValue = async (value: string, hashedValue: string) => {
  return await bcrypt.compare(value, hashedValue);
};
