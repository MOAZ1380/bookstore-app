import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { BadRequestException } from '@nestjs/common';

export function createMulterOptions(folder: string) {
  const uploadPath = `./uploads/${folder}`;

  if (!existsSync(uploadPath)) {
    mkdirSync(uploadPath, { recursive: true });
  }

  return {
    storage: diskStorage({
      destination: (req, file, cb) => {
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        const uniqueSuffix = `${folder}.${Date.now()}-${Math.round(
          Math.random() * 1e9,
        )}.${ext}`;
        cb(null, uniqueSuffix);
      },
    }),
    fileFilter: (req: any, file: { mimetype: string }, cb) => {
      if (!file.mimetype.match(/^image\/(jpg|jpeg|png|webp)$/)) {
        cb(new BadRequestException('Only image files are allowed!'), false);
      } else cb(null, true);
    },
    limits: { fileSize: 1024 * 1024 * 5 },
  };
}
