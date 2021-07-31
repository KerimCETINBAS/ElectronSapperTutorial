import { readdirSync } from "fs";


export default async (window) => {
    const ipcDir = readdirSync(__dirname + '/ipcListeners')

    ipcDir.forEach( async ipcListener => {
       await ( await import(__dirname + '/ipcListeners/' + ipcListener)).default()
    })

}