import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
  BadRequestException,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname, join } from "path";
import { existsSync, mkdirSync } from "fs";
import { EmployeeService } from "./employee.service";
import { AuthGuard } from "../auth/guards/auth.guard";

const uploadDir = join(process.cwd(), "uploads");
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir, { recursive: true });
}

@Controller("api/attendance")
@UseGuards(AuthGuard)
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post("check-in")
  @UseInterceptors(
    FileInterceptor("photo", {
      storage: diskStorage({
        destination: uploadDir,
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
          cb(
            null,
            file.fieldname + "-" + uniqueSuffix + extname(file.originalname),
          );
        },
      }),
      limits: { fileSize: 3 * 1024 * 1024 }, // 5MB max
      fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const extnameMatch = filetypes.test(
          extname(file.originalname).toLowerCase(),
        );
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extnameMatch) {
          return cb(null, true);
        } else {
          cb(
            new BadRequestException(
              "Only images (jpeg, jpg, png) are allowed!",
            ),
            false,
          );
        }
      },
    }),
  )
  checkIn(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
    if (!file) {
      throw new BadRequestException("Photo is required");
    }
    const photoUrl = `/uploads/${file.filename}`;
    const userId = req.user.id;
    return this.employeeService.checkIn(userId, photoUrl);
  }
}
