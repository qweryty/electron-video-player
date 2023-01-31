/// <reference types="../common" />
/// <reference types="./renderer" />
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('API', {
    openVideo: () => ipcRenderer.invoke('open-video'),
    onLoadVideo: (callback: (video: VideoResponse) => void) => {
        ipcRenderer.on('load-video', (e, video: VideoResponse) => callback(video))
    },
    onRendererLog: (callback: (message: string) => void) => {
        ipcRenderer.on('renderer-log', (e, message: string) => callback(message))
    }
})

// 