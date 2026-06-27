import { Module } from "@nestjs/common";
import { DatabaseModule } from "./database/database.module";
import { AuthModule } from "./auth/auth.module";
import { AdminModule } from "./admin/admin.module";
import { EmployeeModule } from "./employee/employee.module";

@Module({
  imports: [DatabaseModule, AuthModule, AdminModule, EmployeeModule],
})
export class AppModule {}
