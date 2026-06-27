import { Module, Global } from "@nestjs/common";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export const DATABASE_POOL = "DATABASE_POOL";

const databaseProvider = {
  provide: DATABASE_POOL,
  useFactory: () => {
    return mysql.createPool({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "dexa_db",
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  },
};

@Global()
@Module({
  providers: [databaseProvider],
  exports: [databaseProvider],
})
export class DatabaseModule {}
