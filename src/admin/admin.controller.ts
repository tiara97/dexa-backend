import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  BadRequestException,
  Query,
} from "@nestjs/common";
import { AdminService } from "./admin.service";
import { AuthGuard } from "../auth/guards/auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";

@UseGuards(AuthGuard, RolesGuard)
@Roles("admin")
@Controller("api/admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get("employees")
  getEmployees(
    @Query("index") index?: string,
    @Query("limit") limit?: string,
    @Query("search") search?: string,
  ) {
    const pageIndex = index ? parseInt(index, 10) : 1;
    const pageLimit = limit ? parseInt(limit, 10) : 10;
    return this.adminService.getEmployees(pageIndex, pageLimit, search);
  }

  @Post("employees")
  createEmployee(@Body() createDto: any) {
    if (
      !createDto.nip ||
      !createDto.password ||
      !createDto.name ||
      !createDto.position ||
      !createDto.role
    ) {
      throw new BadRequestException(
        "All fields (nip, password, name, position, role) are required",
      );
    }
    return this.adminService.createEmployee(createDto);
  }

  @Put("employees/:id")
  updateEmployee(@Param("id") id: string, @Body() updateDto: any) {
    return this.adminService.updateEmployee(id, updateDto);
  }

  @Delete("employees/:id")
  deleteEmployee(@Param("id") id: string) {
    return this.adminService.deleteEmployee(id);
  }

  @Get("attendances")
  getAttendances(
    @Query("date") date?: string,
    @Query("status") status?: string,
    @Query("index") index?: string,
    @Query("limit") limit?: string,
  ) {
    const pageIndex = index ? parseInt(index, 10) : 1;
    const pageLimit = limit ? parseInt(limit, 10) : 10;
    return this.adminService.getAttendances(date, status, pageIndex, pageLimit);
  }

  @Get("attendance/:id")
  @Roles("admin", "employee")
  getAttendanceById(@Param("id") id: string) {
    return this.adminService.getAttendanceById(id);
  }
}
