import * as fs from 'fs'
import {
    Document,
    Paragraph,
    TextRun,
    HeadingLevel,
    ISectionOptions,
    Packer,
} from 'docx'
import * as dayjs from 'dayjs'
import { convert } from 'docx-pdf'

export class InvestmentReportDocument {
    private title: string
    private startDate: dayjs.Dayjs
    private endDate: dayjs.Dayjs
    private description: string
    private creator: string
    private sections: Array<ISectionOptions>

    private doc: Document

    constructor(
        private options: {
            endDate: dayjs.Dayjs
            investments: string[]
            gains: string[]
            startDate: dayjs.Dayjs
            sales: string[]
        },
    ) {
        if (options !== undefined) {
            this.startDate = options.startDate
            this.endDate = options.endDate
            this.title = `-${options.endDate.toString()}-Crypto-Report`
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
        const subtitle = `Du ${this.options.startDate
            .toDate()
            .toLocaleDateString()} au ${this.options.endDate
            .toDate()
            .toLocaleDateString()}`
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

    public async to_pdf_buffer(): Promise<Buffer> {
        const buffer = await this.to_buffer()
        const pdfBuffer = await convert(buffer)
        return pdfBuffer
    }
}
