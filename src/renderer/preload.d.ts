declare const API: {
    openVideo: () => VideoResponse | undefined,
    onLoadVideo: (callback: (video: VideoResponse) => void) => void,
    onRendererLog: (callback: (message: string) => void) => void,
}