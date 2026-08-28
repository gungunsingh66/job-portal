import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeType = "application/pdf";
    const allowedExtension = ".pdf";

    const extension = file.originalname
      .toLowerCase()
      .slice(file.originalname.lastIndexOf("."));

    if (file.mimetype !== allowedMimeType || extension !== allowedExtension) {
      return cb(new Error("Only PDF files are allowed"));
    }

    cb(null, true);
  },
});

export { upload };
