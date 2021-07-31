

import { ipcMain } from 'electron'

import ingradient from '../models/ingredients'



export default async () => {

 
    ipcMain.on('addIngradient', async (event, data)=> {

        const newIngradient = await ingradient.add({ name : data }).catch(err => {})

    

    })  
}