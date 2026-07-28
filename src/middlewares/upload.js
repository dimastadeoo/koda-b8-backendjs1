import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);
const UPLOAD_DIR = path.join(_dirname, '../../uploads');

if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storagePictureUsers = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOAD_DIR);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);

        const ext = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, ext);
        cb(null, baseName + '-' + uniqueSuffix + ext);
    },
});

const limitImg = { fileSize: 2 * 1024 * 1024 }; // 2 MB


export const uploadMiddleware = multer({
    storage: storagePictureUsers,
    fileFilter: function (req, file, cb) {
        const allowedType = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
        if (allowedType.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new Error('Upload just image type  extensions (jpeg, png, gif, webp)'), false)
        }
    },
    limits: limitImg
})



