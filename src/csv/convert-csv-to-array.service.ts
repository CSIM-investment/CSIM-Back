import { SentMessageInfo } from 'nodemailer'

export abstract class ConvertCsvToArrayOf<T> {
    run(csv: string): SentMessageInfo {
        const lines = csv.trim().split('\n')
        const headers = lines[0].split(',')
        const datas = lines.slice(1).map((line) => {
            const lineCutted = line.split(',')
            const data = headers.reduce((acc, header, index) => {
                acc[header] = lineCutted[index]
                return acc
            }, {})
            return this.instantiate(data)
        })
        return datas
    }

    protected abstract instantiate(data): T
}
