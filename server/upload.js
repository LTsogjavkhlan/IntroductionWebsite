const multer = require('multer');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 8 * 1024 * 1024 },
    fileFilter(req, file, cb) {
        if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
            return cb(Object.assign(new Error('Зөвхөн зураг (JPEG, PNG, WebP, GIF) оруулах боломжтой.'), { status: 400 }));
        }
        cb(null, true);
    },
});

function uploadImageBuffer(buffer) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: 'mindora' },
            (error, result) => {
                if (error) return reject(error);
                resolve(result.secure_url);
            }
        );
        stream.end(buffer);
    });
}

module.exports = { upload, uploadImageBuffer };
