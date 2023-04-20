import {
    Document,
    HeadingLevel,
    ISectionOptions,
    Packer,
    Paragraph,
    TextRun,
} from 'docx'
import * as dayjs from 'dayjs'
import * as fs from 'fs'
import * as tmp from 'tmp'
import * as mammoth from 'mammoth'
import * as pdf from 'html-pdf'
import { ReportInvestmentsDataInterface } from '../interfaces/ReportInvestmentsData.interface'
import { FileSyncObject } from '../interfaces/FileSyncObject'

export class InvestmentReportDocument {
    public title: string
    private startDate: Date
    private endDate: Date
    private description: string
    private creator: string
    private sections: Array<ISectionOptions>

    private doc: Document

    constructor(private options: ReportInvestmentsDataInterface) {
        if (options !== undefined) {
            this.startDate = options.startDate
            this.endDate = options.endDate
            this.title = `${options.startDate}-${options.endDate}-Crypto-Report`
            this.description = 'Generated report from csim-finance.fr'
            this.creator = 'CSIM-Finance'
            this.sections = []
        }
    }

    private getHeading1(text: string): Paragraph {
        return new Paragraph({
            text: text,
            heading: HeadingLevel.HEADING_1,
        })
    }

    private getSubtitles(text: string): Paragraph {
        return new Paragraph({
            text: text,
        })
    }

    private getSimpleTextParagraph(text: string): Paragraph {
        return new Paragraph({
            children: [new TextRun(text)],
        })
    }

    private getCoverPage(): Paragraph {
        const title = "Rapport d'investissement"
        const subtitle = `Du ${this.options.startDate.toLocaleDateString()} au ${this.options.endDate.toLocaleDateString()}`
        return new Paragraph({
            children: [
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                new TextRun({
                    text: title,
                    bold: true,
                }),
                new TextRun('\n'),
                new TextRun(subtitle),
            ],
            heading: HeadingLevel.TITLE,
        })
    }

    public async create_section_array_with_paragraphs(
        paragraph_array,
    ): Promise<ISectionOptions[]> {
        const sections_to_return = []

        await paragraph_array.forEach((paragraph) => {
            sections_to_return.push(paragraph)
        })

        return sections_to_return
    }

    public set_sections(sections): void {
        this.sections = sections
    }

    public generate_investment_report_using_investments(): void {
        this.sections = [
            {
                children: [this.getCoverPage()],
            },
            {
                children: [
                    this.getHeading1('Liste des investissements'),
                    this.getSimpleTextParagraph(
                        'Vous avez réalisé ${XX} transactions au cours du mois! ' +
                            'Voici la liste des transactions que vous avez éffectuées',
                    ),
                ],
            },
        ]

        this.doc = new Document({
            title: this.title,
            description: this.description,
            creator: this.creator,
            sections: this.sections,
        })
    }

    public async to_buffer(): Promise<Buffer> {
        return await Packer.toBuffer(this.doc)
    }

    public async to_pdf(): Promise<FileSyncObject> {
        const docxBuffer = await this.to_buffer()

        // Create a temporary file to store the Docx buffer
        const docxTempFile = tmp.fileSync()
        fs.writeFileSync(docxTempFile.name, docxBuffer)

        // Convert the Docx file to HTML
        const result = await mammoth.convertToHtml({ path: docxTempFile.name })
        const html = result.value

        // Convert the HTML to PDF and write it to a temporary file
        const pdfTempFile = tmp.fileSync({ postfix: '.pdf' })
        await new Promise((resolve, reject) => {
            pdf.create(html).toFile(pdfTempFile.name, (err, res) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            })
        })

        // Remove the temporary Docx file
        fs.unlinkSync(docxTempFile.name)

        // Return the file path of the PDF file
        return pdfTempFile
    }
}
