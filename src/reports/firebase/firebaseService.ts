import { Injectable } from '@nestjs/common'
import * as fs from 'fs'
import * as admin from 'firebase-admin'
import { Bucket } from '@google-cloud/storage'

@Injectable()
export class FirebaseService {
    constructor() {
        this.bucket = admin.storage().bucket(process.env.BUCKET_NAME)
    }
    private bucket: Bucket

    async uploadPdf(pdfTempFile: { name: string }): Promise<void> {
        const pdfBuffer = fs.readFileSync(pdfTempFile.name)
        const pdfFilePath = `pdfs/${pdfTempFile.name}`
        const file = this.bucket.file(pdfFilePath)
        await file.save(pdfBuffer, {
            metadata: {
                contentType: 'application/pdf',
            },
        })
        console.log(`PDF file uploaded to ${pdfFilePath}`)
    }
}
