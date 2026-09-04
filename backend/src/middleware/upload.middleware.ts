import multer from "multer";
import { Request, Response, NextFunction } from "express";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB per PDF
const MAX_FILES = 20;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: MAX_FILES,
  },
  fileFilter: (_req: Request, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error(`Only PDF files are allowed. Received: ${file.mimetype}`));
    }
  },
});

export function uploadResumes(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  upload.array("resumes", MAX_FILES)(req, res, (err: unknown) => {
    if (err) {
      const message =
        err instanceof Error ? err.message : "File upload failed";
      res.status(400).json({ success: false, error: message });
      return;
    }
    next();
  });
}
