'use strict';
import Express from 'express';
import BodyParser from 'body-parser';
import Cors from 'cors';
import FS from 'fs';
import Http from 'http';
import Path from 'path';
import Helmet from 'helmet';
import Logger from './helpers/logger';
import Compress from 'compression';
import MethodOverride from 'method-override';
import { port, db } from './config';
import Response from './helpers/response';
import I18N from 'i18n';
import { connect } from './models';
import { InitController } from './controllers';

const app = Express();

I18N.configure({
    locales: ['en'],
    directory: __dirname + '/locales',
    defaultLocale: 'en',
    autoReload: true,
    updateFiles: false
});

app.use(I18N.init)
    .use(Cors())
    .use(Compress())
    .use(MethodOverride())
    .use(BodyParser.json())
    .use(BodyParser.urlencoded({ extended: true }))
    .use(
        Express.static(Path.resolve(__dirname, '..', 'public'), {
            maxAge: 31557600000
        })
    )
    .use(Helmet());

app.set('views', Path.join(__dirname, 'pages')).set('view engine', 'ejs');

app.get('/favicon.ico', (req, res) => res.status(204));

global.__rootDir = __dirname.replace('/server', '');

// Bootstrap routes
const router = Express.Router();
const routePath = `${__dirname}/routes`;
FS.readdir(routePath, (e, fileNames) => {
    if (e) {
        Logger.error(new Error(e));
    } else {
        for (const fileName of fileNames) {
            require(`${routePath}/${fileName}`)(app, router);
        }
        app.use(router);
        app.use(notFoundAPIHandle);
        app.use((e, req, res, next) => {
            Logger.error(new Error(e));
            return Response.error(res, e);
        });
    }
});

const notFoundAPIHandle = (req, res, next) => {
    const error = new Error(req.originalUrl + ' API NOT FOUND');
    return next(error);
};

connect(db).then(() => {
    Http.createServer(app).listen(port, () => {
        console.log(`App listening on ${port}!`);
    });
    // InitController.initDefault();
});

module.exports = app;
