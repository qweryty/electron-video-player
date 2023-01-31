/// <reference types="../common" />
import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import * as path from 'path'
import * as mime from 'mime/lite'
import * as fs from 'fs'

function openVideo(files: string[]) {
    const { dir, base, ext, name } = path.parse(files[0])
    const POSSIBLE_SUBTITLE_PATHS = ['', 'subs', 'sub', 'subtitles']
    let subs: { source: string }[] = []
    for (let subPath of POSSIBLE_SUBTITLE_PATHS) {
        let combinedPath = path.join(dir, subPath, name)

        if (fs.existsSync(combinedPath + '.vtt')) {
            subs.push({ source: combinedPath + '.vtt' });
        }

        if (fs.existsSync(combinedPath + ext + '.vtt')) {
            subs.push({ source: combinedPath + ext + '.vtt' });
        }
    }
    return {
        source: files[0],
        type: mime.getType(files[0]),
        subtitles: subs,
    }
}

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
        frame: false,
    })
    ipcMain.handle('open-video', () => {
        let result = dialog.showOpenDialogSync({
            properties: ['openFile'],
            filters: [
                { name: 'Video', extensions: ['mp4', 'webm'] }
            ]
        })
        if (result == null)
            return

        return openVideo(result)
    });

    win.loadFile('index.html')

    let executableArgv = 2;
    // win.webContents.send('renderer-log', executableArgv)
    // win.webContents.send('renderer-log', process.argv)
    if (process.argv.length > executableArgv)
        win.webContents.send('load-video', openVideo(process.argv.slice(executableArgv)))
}

app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})