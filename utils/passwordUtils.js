import bcryptjs from "bcryptjs";

export async function encryptPassword({ password }) {
  const salt = await bcryptjs.genSalt(10);
  const encryptedPassword = await bcryptjs.hash(password, salt);
  return encryptedPassword;
}

export const comparePassword = async ({ requestedPassword, originalPassword }) => {
  const response = await bcryptjs.compare(requestedPassword, originalPassword);

  return response;
};
