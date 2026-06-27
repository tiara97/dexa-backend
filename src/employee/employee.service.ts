import { Injectable, Inject } from "@nestjs/common";
import { DATABASE_POOL } from "../database/database.module";
import dotenv from "dotenv";

dotenv.config();

@Injectable()
export class EmployeeService {
  constructor(@Inject(DATABASE_POOL) private readonly pool: any) {}

  async checkIn(userId: string, photoUrl: string) {
    const checkInTime = new Date();
    const timeLimit = parseInt(process.env.TIME_LIMIT || "9", 10);
    const deadline = new Date(checkInTime);
    deadline.setHours(timeLimit, 0, 0, 0);

    const status = checkInTime > deadline ? 2 : 1;

    const [result]: any = await this.pool.query(
      "INSERT INTO attendances (user_id, check_in_time, photo_url, status) VALUES (?, ?, ?, ?)",
      [userId, checkInTime, photoUrl, status],
    );

    return {
      message: "Check-in successful",
      attendanceId: result.insertId,
      photoUrl,
      checkInTime,
      status,
    };
  }
}
