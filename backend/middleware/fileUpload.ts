import { Request } from 'express'
import multer from 'multer'
import multerS3 from 'multer-s3'
import { S3Client } from '@aws-sdk/client-s3'

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
})

export const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET_NAME!,
    acl: 'public-read',
    metadata: function (req: Request, file: Express.Multer.File, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req: Request, file: Express.Multer.File, cb) {
      cb(null, Date.now().toString() + '-' + file.originalname)
    }
  })
})

