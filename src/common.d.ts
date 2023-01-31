interface Subtitle{
    source: string
}
interface VideoResponse{
    source: string;
    type: string;
    subtitles: Subtitle[];
}