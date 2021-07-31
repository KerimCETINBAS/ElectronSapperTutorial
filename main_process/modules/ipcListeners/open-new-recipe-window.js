
import { ipcMain, BrowserWindow } from 'electron'

import ingradient from '../models/ingredients'


import { mainWindow } from '../../app'

let win


export default async () => {

    let ingradients  = await ingradient.get().catch(e => {

        console.error(e)
    })

    ipcMain.handle('ingradients', () => ingradients);
    ipcMain.on('open-new-recipe-window', async (event, data) => {

       

        win = new BrowserWindow({width : 1200, height :  690, modal : true, parent : mainWindow, 

            resizable : false,
            fullscreenable: false,
            webPreferences : {
                nodeIntegration : true,

                preload : __dirname + '/../preload.js'}})
        win.setMenu(null)
        await win.loadURL('app://-/tarif_ekle');

    })

}