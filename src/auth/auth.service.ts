import { Injectable, Inject, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { DATABASE_POOL } from "../database/database.module";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  constructor(
    @Inject(DATABASE_POOL) private readonly pool: any,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { nip, password } = loginDto;

    if (!nip || !password) {
      throw new UnauthorizedException("NIP and password are required");
    }

    let rows: any;
    try {
      [rows] = await this.pool.query("SELECT * FROM users WHERE nip = ?", [
        nip,
      ]);
    } catch (err: any) {
      if (err.code === "ER_ACCESS_DENIED_ERROR") {
        throw new UnauthorizedException(
          "Database access denied. Please check your credentials.",
        );
      }
      console.error("Database query error in login:", err);
      throw new UnauthorizedException("Database error: " + err?.message);
    }

    if (rows.length === 0) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const payload = {
      id: user.id,
      nip: user.nip,
      role: user.role,
      name: user.name,
    };
    const token = await this.jwtService.signAsync(payload);

    return {
      message: "Login successful",
      token,
      user: {
        id: user.id,
        nip: user.nip,
        role: user.role,
        name: user.name,
        position: user.position,
      },
    };
  }

  logout() {
    return {
      message: "Logout successful",
    };
  }
}
