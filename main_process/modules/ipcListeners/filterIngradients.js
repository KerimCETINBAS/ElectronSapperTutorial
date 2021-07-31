
import { ipcMain } from 'electron'

import ingradient from '../models/ingredients'




export default async () => {


    ipcMain.handle('filterIngradient', async (event, data) => {
        let ingradients  = await ingradient.get().catch(e => {

            console.error(e)
        })
    
        const ingradients_ =  ingradients.rows && ingradients.rows.map(x => x.doc.name)
        
        let filtered = []
        ingradients_.forEach((ingradient, index)=> {
            //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp
        
            
            if(ingradient.search(new RegExp(data, "i")) != -1) {
                filtered.push(ingradients.rows && ingradients.rows[index] )
            }

            
        })

       return filtered


    })
}