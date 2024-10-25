
import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import path from 'path';

class FileUploadService {
  private static allowedFileTypes = /jpeg|jpg|png|gif/;
  private static maxFileSize = 6 * 1024 * 1024; // 2MB

  private static fileFilter(req: Request, file: Express.Multer.File, cb: FileFilterCallback): void {
    const extname = FileUploadService.allowedFileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimeType = FileUploadService.allowedFileTypes.test(file.mimetype);

    if (mimeType && extname) {
      cb(null, true);
    } else {
      cb(new Error('Invalid image type. Only JPEG, PNG, and GIF are allowed.'));
    }
  }

  public static getUploadMiddleware() {
    return multer({
      storage: multer.memoryStorage(),
      limits: { fileSize: FileUploadService.maxFileSize },
      fileFilter: FileUploadService.fileFilter,
    })
    .single('image');
  }
}

export default FileUploadService;


