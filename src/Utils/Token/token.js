import jwt from "jsonwebtoken";
export const generateToken = ({ user, tokenType }) => {
  const normalizedType = tokenType?.toLowerCase();
  const secret =
    normalizedType === "access"
      ? process.env.JWT_SECRET_ACCESS_ADMIN
      : process.env.JWT_SECRET_REFRESH_ADMIN;

  return jwt.sign({ id: user.id, role: user.role?.name }, secret, {
    expiresIn: normalizedType === "access" ? "1y" : "10y",
  });
};

export const verifyToken = ({ token, tokenType = tokenTypeEnum.access }) => {
  const normalizedType = tokenType?.toLowerCase();
  const secret =
    normalizedType === "access"
      ? process.env.JWT_SECRET_ACCESS_ADMIN
      : process.env.JWT_SECRET_REFRESH_ADMIN;

  return jwt.verify(token, secret);
};

const tokenTypeEnum = {
  access: "access",
  refresh: "refresh",
};
