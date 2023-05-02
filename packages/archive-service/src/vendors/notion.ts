import { Client } from '@notionhq/client';
import { markdownToBlocks } from '@tryfabric/martian';

import type { BlockObjectRequest } from '@notionhq/client/build/src/api-endpoints.js';
import type { Parsed } from '../parse.js';


export const getNotionClient = (apiKey: string): Client => {
    return new Client({ auth: apiKey });
}

export const prepareBlocks = (content: string): BlockObjectRequest[] => {
    return markdownToBlocks(content) as BlockObjectRequest[];
}

export const createPage = async (
    notion: Client,
    databaseId: string,
    pageContent: Parsed,
) => {
    const created = await notion.pages.create({
        parent: {
            type: 'database_id',
            database_id: databaseId
        },
        properties: {
            "Title": {
                title: [
                    {
                        text: {
                            content: pageContent.title,
                        }
                    }
                ]
            },
            "Origin": {
                rich_text: [
                    {
                        text: {
                            content: pageContent.origin,
                        }
                    }
                ],
            },
            "URL": {
                url: pageContent.url,
            },
        },
        children: prepareBlocks(pageContent.content),
    });

    return created;
}
