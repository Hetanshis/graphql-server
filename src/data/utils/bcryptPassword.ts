import bcrypt from "bcryptjs";
const bcryptPassword = async (password: string) => {
  const salt = await bcrypt.genSaltSync(10);
  const pass = await bcrypt.hash(salt, password);
  return pass;
};
export default bcryptPassword;
