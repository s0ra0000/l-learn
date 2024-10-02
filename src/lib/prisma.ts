import { PrismaClient } from "@prisma/client";

declare global {
  // Allow global `prisma` to be set in the Node.js environment
  // This prevents TypeScript from complaining about type issues.
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;
