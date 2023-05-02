import Koa from 'koa';
import Router from '@koa/router';
import koaJson from 'koa-json';
import bodyparser from 'koa-bodyparser';
import { z } from "zod";

import { archiveArticle, saveToNotion } from './parse.js';


export const ArchiveRequest = z.object({
    url: z.string().url(),
    useArchive: z.boolean().default(() => false),
});

export const setupApp = (): Koa => {
    const app = new Koa();

    app.use(bodyparser());
    app.use(koaJson());

    app.use(async (context, next) => {
        try {
            await next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                context.response.status = 400;
                context.response.body = { 'errors': error.issues };
                context.response.headers['Content-Type'] = 'application/json';
            } else {
                console.log(error);
                context.response.status = 500;
                context.response.body = { 'errors': ['Internal Server Error'] };
                context.response.headers['Content-Type'] = 'application/json';
            }
        }
    });


    const router = new Router();

    router.post('/archive', async (ctx, _next) => {
        const payload = ArchiveRequest.parse(ctx.request.body);

        await archiveArticle(payload.url, saveToNotion);
        ctx.body = 'Saved';
    });

    app
        .use(router.routes())
        .use(router.allowedMethods());

    return app;
};
