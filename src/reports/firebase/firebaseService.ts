import { Injectable } from '@nestjs/common'
import * as fs from 'fs'
import * as admin from 'firebase-admin'
import { Bucket } from '@google-cloud/storage'
import path from "path";

@Injectable()
export class FirebaseService {
    constructor() {
        this.bucket = admin.storage().bucket(process.env.BUCKET_NAME)
    }
    private bucket: Bucket

    async uploadPdf(pdfBuffer: Buffer): Promise<string> {
        const pdfFilePath = `pdfs/${Date.now()}.pdf`
        const file = this.bucket.file(pdfFilePath)
        await file.save(pdfBuffer, {
            metadata: {
                contentType: 'application/pdf',
            },
        })
        console.log(`PDF file uploaded to ${pdfFilePath}`)

        return pdfFilePath
    }
}
