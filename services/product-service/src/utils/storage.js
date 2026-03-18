const { S3Client, GetObjectCommand, DeleteObjectCommand  } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const config = require('../config');

const s3 = new S3Client({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.accessKey,
    secretAccessKey: config.aws.secretKey,
  },
});

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const upload = multer({
  storage: multerS3({
    s3,
    bucket: config.aws.bucketName,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const key = `products/${uuidv4()}${ext}`;
      cb(null, key);
    },
  }),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG and WebP images are allowed'));
    }
  },
});

const getImageUrl = async (key) => {
  if (!key) return null;
  const command = new GetObjectCommand({
    Bucket: config.aws.bucketName,
    Key: key,
  });
  return getSignedUrl(s3, command, { expiresIn: 3600 });
};

const deleteImage = async (key) => {
  if (!key) return;
  const command = new DeleteObjectCommand({
    Bucket: config.aws.bucketName,
    Key: key,
  });
  await s3.send(command);
};

module.exports = { upload, getImageUrl, s3, deleteImage };