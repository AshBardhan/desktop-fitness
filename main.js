const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

var isAppFocused = false;

function getTimeValue(timeValue) {
    return ('0' + timeValue).substr(-2);
}

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({width: 1280, height: 800})

    // and load the index.html of the app.
    mainWindow.loadFile('index.html');
    isAppFocused = true;

    // Open the DevTools.
    mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    });


    setInterval(function () {
        mainWindow.webContents.session.cookies.get({name: 'time'}, function (error, cookies) {
            if (cookies && cookies.length) {
                var cookieTimeList = cookies[0].value;
                var currentDate = new Date();
                var currentTime = getTimeValue(currentDate.getHours()) + ':' + getTimeValue(currentDate.getMinutes()) + ':' + getTimeValue(currentDate.getSeconds());

                if (cookieTimeList.length) {
                    cookieTimeList = cookieTimeList.split('|');
                    cookieTimeList.forEach(function (time) {
                        var timeTenSecondsAfter = time + ':10';
                        time = time + ':00';
                        if (currentTime >= time && currentTime <= timeTenSecondsAfter && !isAppFocused) {
                            app.focus();
                            return;
                        }
                    });
                }
            }
        });
    }, 500);

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
})

app.on('browser-window-blur', function () {
    isAppFocused = false;
})

app.on('browser-window-focus', function () {
    isAppFocused = true;
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.