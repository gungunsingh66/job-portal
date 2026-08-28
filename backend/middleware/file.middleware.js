import { ApiError } from "../utils/ApiError.js";

const validatePdfFile = (req, res, next) => {
    if (!req.file) {
        throw new ApiError(400, "Resume file is required");
    }

    const pdfSignature = req.file.buffer
        .subarray(0, 5)
        .toString("ascii");

    if (pdfSignature !== "%PDF-") {
        throw new ApiError(400, "Invalid PDF file");
    }

    next();
};

export { validatePdfFile };