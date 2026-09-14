// File/media upload handling (multer -> storage provider).
import { AppError } from '../middleware/error.middleware';

export interface StoredFile {
  url: string;
  type: 'image' | 'video' | 'document';
}

export class UploadService {
  static async storeFile(file: Express.Multer.File): Promise<StoredFile> {
    if (!file) {
      throw new AppError(400, 'NO_FILE', 'No file provided');
    }

    const type =
      file.mimetype.startsWith('image/') ? 'image' :
      file.mimetype.startsWith('video/') ? 'video' :
      'document';

    // TODO: Upload to chosen storage provider (local/S3/GCS) and return public URL.
    return {
      url: `/uploads/${file.originalname}`,
      type,
    };
  }
}