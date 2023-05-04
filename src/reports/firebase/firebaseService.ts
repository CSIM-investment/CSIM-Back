import { Injectable } from '@nestjs/common'
import * as admin from 'firebase-admin'
import { Bucket, GetSignedUrlConfig } from '@google-cloud/storage'
import { FileSyncObject } from '../interfaces/FileSyncObject'
import { randomUUID } from 'crypto'

@Injectable()
export class FirebaseService {
    constructor() {
        this.bucket = admin.storage().bucket(process.env.BUCKET_NAME)
    }
    private bucket: Bucket

    async uploadPdf(pdfBuffer: Buffer, nameOfPdf: string): Promise<string> {
        const pdfFilePath = `reports/pdfs/${nameOfPdf}.pdf`
        const file = this.bucket.file(pdfFilePath)

        await file.save(pdfBuffer, {
            metadata: {
                contentType: 'application/pdf',
            },
        })

        console.log(`PDF file uploaded to ${pdfFilePath}`)

        // Set the download URL options
        const downloadUrlOptions: GetSignedUrlConfig = {
            action: 'read',
            expires: '03-09-2491', // Set a far future expiration date or any other date as per your requirements
        }

        // Generate the download URL
        const [downloadUrl] = await file.getSignedUrl(downloadUrlOptions)

        console.log(`${downloadUrl}&token=${randomUUID()}`)

        // Append the token to the download URL
        return `${downloadUrl}&token=${randomUUID()}`
    }
}
