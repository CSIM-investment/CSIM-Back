import * as tmp from 'tmp'

export interface FileSyncObject {
    name: string
    fd?: number
    removeCallback: tmp.fileCallback | tmp.fileCallbackSync
}
