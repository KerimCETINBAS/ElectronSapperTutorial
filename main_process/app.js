import { app, BrowserWindow} from 'electron'
import { resolve } from 'path'

import ingradient from './modules/models/ingredients'
import ipc from './modules/ipc'
const path = require('path')

// html dosyasını serve et
export let mainWindow;

const serve = require('electron-serve');
const loadURL = serve({directory: '../renderer/__sapper__/export', });

;(async () => {

    // uyguluma hazır olana kadar beklet
    try {

   
        await app.whenReady();

      
        ipc(mainWindow)
 
        mainWindow = new BrowserWindow({
            width: 1326,
            height : 620,
            resizable : false,
            fullscreenable: false,
            webPreferences : {
                nodeIntegration : true,
                preload: resolve(__dirname , 'modules', 'preload.js')
            }
        });
        // Menuye ihtiyaç yok
        mainWindow.setMenu(null)
       
       // await loadURL(mainWindow);
       //mainWindow.webContents.openDevTools()
        await mainWindow.loadURL('app://-')

        let ingradients  = await ingradient.get().catch(e => {

        })


        mainWindow.webContents.send('malzeme', ingradients.rows)

        } catch (error) {

        }
})();



// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
