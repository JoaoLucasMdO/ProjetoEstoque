// express.d.ts
import express from 'express';

declare global {
  namespace Express {
    export interface Request {
      file?: Express.Multer.File;
    }
  }
}

