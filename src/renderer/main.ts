/// <reference types="../common" />
/// <reference types="./preload" />
// import { IpcRenderer } from 'electron';
import hotkeys from 'hotkeys-js';
// import { ipcRenderer } from 'electron';
// let ipcRenderer:IpcRenderer = window.require('electron').ipcRenderer;

const video = document.getElementById('video') as HTMLVideoElement;

let currentVideo: VideoResponse | undefined;

function setVideo(videoResponse?: VideoResponse, play: boolean = true) {
    if (!videoResponse)
        return;

    currentVideo = videoResponse;

    video.innerHTML = '';
    const source = document.createElement('source') as HTMLSourceElement;
    if (!videoResponse.source.startsWith('file://'))
        videoResponse.source = 'file://' + videoResponse.source;

    source.src = videoResponse.source;
    source.type = videoResponse.type;
    video.append(source)
    for (const [i, subtitle] of videoResponse.subtitles.entries()) {
        const subtitleElement = document.createElement('track') as HTMLTrackElement;
        subtitleElement.kind = 'subtitles'
        if (i === 0)
            subtitleElement.default = true;
        subtitleElement.src = subtitle.source;
        // TODO
        // subtitleElement.label = `Unknown ${i}`
        // subtitleElement.srclang = `jp`
        video.append(subtitleElement)
    }

    if (play) {
        video.play()
    }
}

function reloadVideo() {
    let play = !video.paused;
    let currentTime = video.currentTime;
    setVideo(currentVideo, play);
    video.currentTime = currentTime;
}

function openHandler() {
    (async () => {
        const videoResponse = await API.openVideo();
        setVideo(videoResponse);
    })();
}

API.onLoadVideo(setVideo);
API.onRendererLog(console.log);

hotkeys('ctrl+o', openHandler);
hotkeys('f5', reloadVideo);
hotkeys('f', () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
        document.exitFullscreen();
    }
});
hotkeys('q', () => window.close());
// window.onkeydown = () => {};
// window.onkeyup = () => {};
hotkeys('space', (event, handler) => {
    // FIXME disable onkeyup?
    // console.log('space')
    // event.preventDefault()
    // event.stopPropagation()
    // // TODO disable focus
    // if (video.paused)
    //     video.play()
    // else
    //     video.pause()
})