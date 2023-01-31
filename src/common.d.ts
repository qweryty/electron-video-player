interface Subtitle {
    source: string;
    cues: Cue[];
}

interface VideoResponse {
    source: string;
    type: string;
    subtitles: Subtitle[];
}