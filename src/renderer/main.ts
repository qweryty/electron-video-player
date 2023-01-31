/// <reference types="../common" />
/// <reference types="./preload" />
// import { IpcRenderer } from 'electron';
import hotkeys from 'hotkeys-js';
// import { ipcRenderer } from 'electron';
// let ipcRenderer:IpcRenderer = window.require('electron').ipcRenderer;

const video = document.getElementById('video') as HTMLVideoElement;

let currentVideo: VideoResponse | undefined;
let selectedTrackIndex = 0;
var subtitles: Subtitle[] = [];

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
    video.append(source);

    subtitles = videoResponse.subtitles;

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

function cueIndexByTime() {
    if (selectedTrackIndex < 0 || selectedTrackIndex >= subtitles.length)
        return
    let subtitle = subtitles[selectedTrackIndex];
    let currentTime = video.currentTime
    for (let [i, cue] of subtitles[selectedTrackIndex].cues.entries()) {
        if (currentTime >= cue.start && currentTime <= cue.end)
            return i;
    }
}

function nextCue() {
    let currentCueIndex = cueIndexByTime();
    if (currentCueIndex == null) {
        return
    }
    let nextCueIndex = currentCueIndex + 1;
    if (nextCueIndex >= subtitles[selectedTrackIndex].cues.length)
        nextCueIndex = subtitles[selectedTrackIndex].cues.length - 1;

    // Adding small amount of time so it won't land exactly on subtitle intersection
    video.currentTime = subtitles[selectedTrackIndex].cues[nextCueIndex].start + 1 / 24;
}

function previousCue() {
    let currentCueIndex = cueIndexByTime();
    if (currentCueIndex == null) {
        return
    }
    let nextCueIndex = currentCueIndex - 1;
    if (nextCueIndex < 0)
        nextCueIndex = 0;

    // Adding small amount of time so it won't land exactly on subtitle intersection
    video.currentTime = subtitles[selectedTrackIndex].cues[nextCueIndex].start + 1 / 24;
}

video.textTracks.onchange = function () {
    for (let i = 0; i < video.textTracks.length; i++) {
        let track = video.textTracks[i];
        if (track.mode === "showing") {
            selectedTrackIndex = i;
            break;
        }
    }
};


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
hotkeys('pageup', nextCue);
hotkeys('pagedown', previousCue);
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