

import { ipcMain } from 'electron'

import recipes from '../models/tarif'
import { mainWindow } from '../../app'

export default async () => {

 
    ipcMain.handle('add-recipe', async (event, data = {})=> {

        const e = await recipes.add({
            ...data
        })
        
       mainWindow.webContents.send('new-recipe-added')
       return e



        

    })  
}