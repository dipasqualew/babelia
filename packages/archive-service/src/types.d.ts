declare module '@postlight/parser' {
    export interface ParserOpts {
        html?: string;
        contentType?: 'html' | 'markdown';
    }

    export interface Parsed {
        title?: string;
        content?: string;
    }

    export function parse(
        url: string,
        opts: ParserOpts,
    ): Promise<Parsed>
}
