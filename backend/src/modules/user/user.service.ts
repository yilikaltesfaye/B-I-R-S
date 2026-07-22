import prisma from "../../clients/prismaClient";

export const getUserById = (userId: string) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      role: true,
      refreshToken: true,
    },
  });
};
