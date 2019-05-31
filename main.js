// Modules to control application life and create native browser window
//const {app, BrowserWindow} = require('electron')
const {app, BrowserWindow, ipcMain} = require('electron');
const {autoUpdater} = require("electron-updater");
const { webContents } = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
const path = require('path');
const Store = require('./storage.js');
const store = new Store();
store.init({
  configName: 'user-preferences',
  defaults: {
    // 1280x1080 is the default size of our window
    windowBounds: { width: 1280, height: 1080 }
  }
});
function createWindow () {
  // Create the browser window.
  let { width, height } = store.get('windowBounds');
  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    title:"GraffixApp",
    webPreferences: {
      nodeIntegration: true
    }
  })
  // and load the index.html of the app.
  mainWindow.loadFile('newIndex.html')
  //mainWindow.loadFile()
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  mainWindow.on('close', function () {
    let size = mainWindow.getSize();
    let { width, height } = mainWindow.getBounds();
    // Now that we have them, save them using the `set` method.
    store.set('windowBounds', { width, height });
    console.log(size);

  });
  require('./menu/mainmenu')
   autoUpdater.checkForUpdates();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  console.log(__filename);
  //console.log(webContents.getFocusedWebContents().getURL().replace(/^.*[\\\/]/, ''));
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})
autoUpdater.on('update-downloaded', (info) => {
  console.log("Update downloaded");
    win.webContents.send('updateReady')
});

ipcMain.on("quitAndInstall", (event, arg) => {
    autoUpdater.quitAndInstall();
})

require('update-electron-app')({
  updateInterval: '5 minutes',
  logger: require('electron-log')
})
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
