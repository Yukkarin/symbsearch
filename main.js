const {app, BrowserWindow, globalShortcut} = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({width: 400, height: 400, frame: false, resizable: false})

  // and load the index.html of the app.
  win.loadURL(`file://${__dirname}/index.html`)

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

app.on('ready', () => {
   // Register a 'CommandOrControl+X' shortcut listener.
   const ret = globalShortcut.register('Super+S', () => {
     console.log('Super+S is pressed')
     if(win==null) {
       createWindow()
     } else if (win.isVisible()) {
       win.hide()
       console.log("Window hidden")
     } else {
       win.show()
       console.log("Window shown")
     }
   })

   if (!ret) {
     console.log('registration failed')
   }

   // Check whether a shortcut is registered.
   console.log(globalShortcut.isRegistered('Super+S'))
})

//app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

app.on('will-quit', () => {
  // Unregister all shortcuts.
  globalShortcut.unregisterAll()
})
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
