

import { ipcMain } from 'electron'

import recipes from '../models/tarif'


export default async () => {

 
    ipcMain.handle('get-recipes', async (event, data = {})=> {
       return (await recipes.get()).rows

    

    })  
}