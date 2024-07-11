import bcrypt from "bcryptjs";
const comparePassword = async (inputPassword: string, password: string) => {
  const pass = await bcrypt.compare(inputPassword, password);
  return pass;
};
export default comparePassword;
