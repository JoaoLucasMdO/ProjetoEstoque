// middleware/upload.ts
import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';

const storage = multer.memoryStorage();

const upload = multer({ 
  storage: storage,
  dest: 'uploads/',
  fileFilter(req: Request, file: multer.File, cb: FileFilterCallback) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Please upload an image'));
    }
    cb(null, true);
  }
});

export default upload;
