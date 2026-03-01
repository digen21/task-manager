import { User } from "@entity";

const sanitizeUserResponse = (user: Partial<User>) => {
  if (!user) return null;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...userInfo } = user;

  return userInfo;
};

export default sanitizeUserResponse;
