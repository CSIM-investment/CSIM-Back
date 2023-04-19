export abstract class ConvertCsvToArrayOf<T> {
    run(csv: string): T[] {
        const lines = csv.trim().split('\n')
        const headers = lines[0].split(',')
        const datas = lines.slice(1).map((line) => {
            const lineCutted = line.split(',')
            const data = headers.reduce((acc, header, index) => {
                header = header.replace(/\r/g, '')
                acc[header] = lineCutted[index].replace(/\r/g, '')
                return acc
            }, {})
            return this.instantiate(data)
        })
        return datas
    }

    protected abstract instantiate(data): T
}
