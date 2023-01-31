interface Cue {
    identifier: string;
    start: number;
    end: number;
    text: string;
    styles: string;
}

interface ParseResult {
    valid: boolean;
    cues: Cue[];
}
declare module "node-webvtt" {
    export function parse(input: string): ParseResult;
}