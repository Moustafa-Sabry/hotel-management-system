import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';

export const carMulterOptions = {
  storage: diskStorage({
    destination: './uploads/cars',

    filename: (req, file, cb) => {
      const uniqueSuffix =
        Date.now() + '-' + Math.round(Math.random() * 1e9);

      cb(null, uniqueSuffix + extname(file.originalname));
    },
  }),

  fileFilter: (req, file, cb) => {
    const allowedExtensions = /jpg|jpeg|png|webp/;

    const isValid = allowedExtensions.test(
      extname(file.originalname).toLowerCase(),
    );

    if (!isValid) {
      return cb(
        new BadRequestException(
          'Only jpg, jpeg, png and webp images are allowed',
        ),
        false,
      );
    }

    cb(null, true);
  },

  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
};