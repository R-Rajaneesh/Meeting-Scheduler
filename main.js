// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu, Tray, Notification } = require("electron");
const path = require("path");

const Closing_title = "Meeting Scheduler";
const Closing_body =
  "Since you are closing Meeting scheduler, your meetings will not be saved and be opened during the time";

const showNotification = function () {
  app.whenReady().then(() => {
    if (app.isQuiting) {
      new Notification({
        title: Closing_title,
        body: Closing_body,
      }).show();
    }
  });
};

function createWindow() {
  // Create the browser window.

  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "./public/js/preload.js"),
    },
  });

  // and load the index.html of the app.
  mainWindow.setMenuBarVisibility(false); //hide default menu bar

  mainWindow.setIcon(path.join(__dirname, "./Nigelrex.ico")); //add app icon

  mainWindow.loadFile("./public/index.html"); //load app file

  tray = new Tray("./Nigelrex.ico");
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Show application",
      click: function () {
        mainWindow.show();
      },
    },
    {
      label: "Quit Meeting Scheduler",
      click: function () {
        mainWindow.hide();
        app.isQuiting = true;
        showNotification();
        setTimeout(() => {
          if (process.platform !== "darwin") app.quit();
        }, 5000);
        // Quit when all windows are closed, except on macOS. There, it's common
        // for applications and their menu bar to stay active until the user quits
        // explicitly with Cmd + Q.
      },
    },
  ]);

  tray.setToolTip("Meeting Scheduler");
  tray.setContextMenu(contextMenu);

  mainWindow.on("minimize", function (event) {
    showNotification();
    event.preventDefault();
    mainWindow.hide();
  });

  mainWindow.on("close", function (event) {
    showNotification();
    if (!app.isQuiting) {
      showNotification();
      event.preventDefault();
      mainWindow.hide();
    }
    showNotification();
    return false;
  });

  // app.on("window-all-closed", function () {
  //   app.isQuiting = true;
  //   mainWindow.hide();
  //   // if (process.platform !== "darwin") app.quit();
  // });

  //above is the default close program

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

//start app
app.whenReady().then(() => {
  console.log("App running!");
  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

let tray = null; //do not move this or the app tray will not work as intended!!
