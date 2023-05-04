import {
    Document,
    HeadingLevel,
    ISectionOptions,
    Packer,
    Paragraph,
    Table,
    TableCell,
    TableRow,
    TextRun,
} from 'docx'
import * as fs from 'fs'
import * as tmp from 'tmp'
import * as mammoth from 'mammoth'
import * as pdf from 'html-pdf'
import { ReportInvestmentsDataInterface } from '../interfaces/ReportInvestmentsData.interface'
import { GainOrLooseByCryptoInterface } from '../interfaces/GainByCryptoInterface.interface'
import { InvestmentEntity } from '../../investments/entities/investment.entity'

export class InvestmentReportDocument {
    public title: string
    private startDate: Date
    private endDate: Date
    private description: string
    private creator: string
    private sections: Array<ISectionOptions>
    private reportsInvestmentData: ReportInvestmentsDataInterface

    private doc: Document

    constructor(private options: ReportInvestmentsDataInterface) {
        if (options !== undefined) {
            this.startDate = options.startDate
            this.endDate = options.endDate
            this.title = `${options.startDate.toISOString()}-${options.endDate.toISOString()}-Crypto-Report`
            this.description = 'Generated report from csim-finance.fr'
            this.creator = 'CSIM-Finance'
            this.sections = []

            this.reportsInvestmentData = options
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

    private getDetailedParagraphForGainOrLooseByCrypto(
        gainOrLooseByCrypto: GainOrLooseByCryptoInterface[],
    ): Paragraph[] {
        let paragraphsToReturn = []
        console.log(gainOrLooseByCrypto)
        gainOrLooseByCrypto.forEach(
            (gainOrLooseByCrypto: GainOrLooseByCryptoInterface) => {
                let childrenToAppendToParagraph = []
                gainOrLooseByCrypto.investmentEntityBuy.forEach(
                    (investmentEntityBuyed: InvestmentEntity) => {
                        console.log(investmentEntityBuyed)
                        childrenToAppendToParagraph.push(new Paragraph(`BUY -> ${
                            investmentEntityBuyed.quantity
                        } ${investmentEntityBuyed.quoteCurrency.symbol} à ${
                            investmentEntityBuyed.quantity *
                            investmentEntityBuyed.valueBaseCurrency
                        } ${investmentEntityBuyed.baseCurrency.symbol} \n`))
                    },
                )
                childrenToAppendToParagraph.push(new Paragraph(`SELL -> ${
                    gainOrLooseByCrypto.investmentEntitySell instanceof
                    InvestmentEntity
                        ? `${gainOrLooseByCrypto.investmentEntitySell.quantity} ` +
                          `${gainOrLooseByCrypto.investmentEntitySell.baseCurrency.symbol} ` +
                          `pour ${
                              gainOrLooseByCrypto.investmentEntitySell
                                  .valueQuoteCurrency *
                              gainOrLooseByCrypto.investmentEntitySell.quantity
                          } € \n`
                        : ''
                }`))
                paragraphsToReturn = paragraphsToReturn.concat(childrenToAppendToParagraph)
            },
        )
        return paragraphsToReturn
    }

    private generateTableBodyOfGainLoosesByCrypto(): TableRow[] {
        const rowsToReturn: TableRow[] = []
        console.log(this.reportsInvestmentData)
        this.reportsInvestmentData.gainOrLooseByCrypto.forEach(
            (value: GainOrLooseByCryptoInterface) => {
                rowsToReturn.push(
                    new TableRow({
                        children: [
                            new TableCell({
                                children: [
                                    new Paragraph(
                                        value.crypto.symbol.toUpperCase(),
                                    ),
                                ],
                            }),
                            new TableCell({
                                children:
                                    this.getDetailedParagraphForGainOrLooseByCrypto(
                                        value.gainOrLooseByCrypto,
                                    ),
                            }),
                            new TableCell({
                                children: [
                                    new Paragraph(value.gains.toString()),
                                ],
                            }),
                        ],
                    }),
                )
            },
        )
        return rowsToReturn
    }

    private generateTableOfGainLoosesByCrypto(): Table {
        let rows = [
            new TableRow({
                tableHeader: true,
                children: [
                    new TableCell({
                        children: [new Paragraph('Crypto')],
                    }),
                    new TableCell({
                        children: [new Paragraph('Investissements')],
                    }),
                    new TableCell({
                        children: [new Paragraph('Gains/Pertes')],
                    }),
                ],
            }),
        ]
        rows = rows.concat(this.generateTableBodyOfGainLoosesByCrypto())
        return new Table({
            rows: rows,
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
                    this.getHeading1('Gains/pertes globals'),
                    this.getSimpleTextParagraph(
                        `Du ${this.startDate.toISOString()} au ${this.endDate.toISOString()}, ` +
                            `vous avez ${
                                this.reportsInvestmentData.gainOfMonth >= 0
                                    ? 'gagné ' +
                                      this.reportsInvestmentData.gainOfMonth
                                    : 'perdu ' +
                                      this.reportsInvestmentData.looseOfMonth
                            }euro.`,
                    ),
                    this.getHeading1('Gains/pertes détaillés'),
                    this.generateTableOfGainLoosesByCrypto(),
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

    public async to_pdf(): Promise<Buffer> {
        const docxBuffer = await this.to_buffer()

        // Write the buffer contents to a local file
        fs.writeFileSync('./test.docx', docxBuffer)

        // Create a temporary file to store the Docx buffer
        const docxTempFile = tmp.fileSync()
        fs.writeFileSync(docxTempFile.name, docxBuffer)

        // Convert the Docx file to HTML
        const result = await mammoth.convertToHtml({ path: docxTempFile.name })
        const html = result.value

        return await new Promise((resolve, reject) => {
            pdf.create(html).toBuffer((err, res) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            })
        })
    }
}
