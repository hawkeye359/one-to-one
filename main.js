const { app, BrowserWindow } = require("electron");
const path = require("path");

let localStream = null;
let remoteStream = null;
let win = null;
app.on("ready", () => {
  win = new BrowserWindow({
    width: 300,
    height: 500,
    backgroundColor: "#48BFE3",
    webPreferences: { nodeIntegration: true },
    show: false,
  });
  win.loadFile(path.join(__dirname, "dist", "index.html"));
  win.once("ready-to-show", () => {
    win.show();
  });
});
