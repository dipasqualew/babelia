import Parser from '@postlight/parser';

import { POM } from './pom.js';
import { createPage, getNotionClient } from './vendors/notion.js'

export interface Parsed {
    title: string;
    content: string;
    url: string;
    origin: string;
    images: string[];
}

export type ExportFunction = (
    parsed: Parsed,
) => Promise<void>;

export const getTitle = (title?: string): string => {
    if (!title) {
        return '';
    }

    return title
        .replace(/ \| .*$/g, '');
};

export const getOrigin = (url: string): string => {
    const stripped = url.replace(/https?:\/\/archive.is\/\d+\//g, '');
    const origin = new URL(stripped).origin;

    return origin
        .replace(/https?:\/\//g, '')
        .replace(/www\./g, '');
};

export const getImages = (content: string): string[] => {
    const match = content.match(/!\[.*\]\((.*)\)/g) || [];

    const images = match.map((m) => m[1]);

    return images;
};

export const processParsed = (url: string, parsed: Parser.Parsed): Parsed => {
    const title = getTitle(parsed.title);
    const content = parsed.content || '';
    const origin = getOrigin(url);
    const images = getImages(content);

    return {
        title,
        content,
        origin,
        url,
        images,
    }
}

export const saveToNotion: ExportFunction = async (
    parsed: Parsed,
): Promise<void> => {
    const apiKey = process.env.NOTION_API_KEY;
    const databaseId = process.env.NOTION_DATABASE_ID;

    if (!apiKey || !databaseId) {
        throw new Error('Notion API key or database ID not set');
    }

    const notion = getNotionClient(apiKey);

    await createPage(notion, databaseId, parsed);
};

export const archiveArticle = async (
    url: string,
    exportFunction: ExportFunction,
): Promise<void> => {
    const pom = new POM();
    const page = await pom.getPage();

    await page.goto(url);
    const html = await page.innerHTML('html');
    const parsed = await Parser.parse(url, { html, contentType: 'markdown' });
    const processed = processParsed(url, parsed);

    await exportFunction(processed);

    await pom.tearDown();
};

export const archiveLite = async (
    url: string,
    path: string,
    exportFunction: ExportFunction,
): Promise<void> => {
    const parsed = await Parser.parse(url, { contentType: 'markdown' });

    const processed = processParsed(url, parsed);

    await exportFunction(processed);
};
