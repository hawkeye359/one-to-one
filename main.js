const { app, BrowserWindow } = require("electron");
const path = require("path");
let localStream = null;
let remoteStream = null;
let win = null;
require("@electron/remote/main").initialize();
app.on("ready", () => {
  win = new BrowserWindow({
    width: 300,
    height: 500,
    backgroundColor: "#48BFE3",
    webPreferences: { nodeIntegration: true, contextIsolation: false },
    show: false,
  });
  win.loadFile(path.join(__dirname, "build", "index.html"));
  win.once("ready-to-show", () => {
    win.show();
  });
});
