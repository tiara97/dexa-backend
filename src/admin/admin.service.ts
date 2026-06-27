import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { DATABASE_POOL } from "../database/database.module";

@Injectable()
export class AdminService {
  constructor(@Inject(DATABASE_POOL) private readonly pool: any) {}

  async getEmployees(index: number = 1, limit: number = 10, search?: string) {
    const offset = (index - 1) * limit;

    let countQuery = "SELECT COUNT(*) as count FROM users";
    let dataQuery =
      "SELECT id, nip, name, position, role, created_at, updated_at FROM users";
    const params: any[] = [];
    const countParams: any[] = [];

    if (search) {
      countQuery += " WHERE name LIKE ?";
      dataQuery += " WHERE name LIKE ?";
      const searchParam = `%${search}%`;
      countParams.push(searchParam);
      params.push(searchParam);
    }

    dataQuery += " LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const [countResult]: any = await this.pool.query(countQuery, countParams);
    const total = countResult[0].count;

    const [rows] = await this.pool.query(dataQuery, params);

    return {
      data: rows,
      meta: {
        total,
        page: index,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async createEmployee(createDto: any) {
    const { nip, password, name, position, role } = createDto;

    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const [result]: any = await this.pool.query(
        "INSERT INTO users (nip, password, role, name, position) VALUES (?, ?, ?, ?, ?)",
        [nip, hashedPassword, role, name, position],
      );

      return {
        message: "Employee created successfully",
        employeeId: result.insertId,
      };
    } catch (error: any) {
      if (error.code === "ER_DUP_ENTRY") {
        throw new ConflictException("NIP already exists");
      }
      throw error;
    }
  }

  async updateEmployee(id: string, updateDto: any) {
    const { nip, name, position, password, role } = updateDto;

    let query = "UPDATE users SET nip = ?, name = ?, position = ?, role = ?";
    const params: any[] = [nip, name, position, role];

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query += ", password = ?";
      params.push(hashedPassword);
    }

    query += " WHERE id = ?";
    params.push(id);

    const [result]: any = await this.pool.query(query, params);

    if (result.affectedRows === 0) {
      throw new NotFoundException("Employee not found");
    }

    return { message: "Employee updated successfully" };
  }

  async deleteEmployee(id: string) {
    const [result]: any = await this.pool.query(
      "DELETE FROM users WHERE id = ?",
      [id],
    );

    if (result.affectedRows === 0) {
      throw new NotFoundException("Employee not found");
    }

    return { message: "Employee deleted successfully" };
  }

  async getAttendances(
    date?: string,
    status?: string,
    index: number = 1,
    limit: number = 10,
  ) {
    const offset = (index - 1) * limit;

    let countQuery = `
      SELECT COUNT(*) as count
      FROM attendances a
      JOIN users u ON a.user_id = u.id
      WHERE 1=1
    `;
    const countParams: any[] = [];

    if (date) {
      countQuery += " AND DATE(a.check_in_time) = ?";
      countParams.push(date);
    }

    if (status) {
      countQuery += " AND a.status = ?";
      countParams.push(Number(status));
    }

    const [countResult]: any = await this.pool.query(countQuery, countParams);
    const total = countResult[0].count;

    let query = `
      SELECT a.id, a.status as status, u.name as employeeName, u.nip as nip, a.check_in_time AS timestamp, a.photo_url AS photoUrl, a.created_at
      FROM attendances a
      JOIN users u ON a.user_id = u.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (date) {
      query += " AND DATE(a.check_in_time) = ?";
      params.push(date);
    }

    if (status) {
      query += " AND a.status = ?";
      params.push(Number(status));
    }

    query += " ORDER BY a.check_in_time DESC LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const [rows] = await this.pool.query(query, params);

    return {
      data: rows,
      meta: {
        total,
        page: index,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getAttendanceById(id: string) {
    const [rows] = await this.pool.query(
      `
      SELECT a.id, a.user_id, a.check_in_time AS timestamp, a.photo_url AS photoUrl, a.created_at
      FROM attendances a
      WHERE a.user_id = ? AND DATE(a.check_in_time) = CURDATE()
      ORDER BY a.check_in_time DESC
    `,
      [id],
    );
    return rows.length > 0 ? rows[0] : null;
  }
}
