import * as path from 'path';

import * as Sentry from '@sentry/node';

import App from './app';
import * as config from './config';

const envPath = process.argv[2] || '.env';
config.loadFromFile(path.resolve(envPath))
    .then(config => {
        if (config.sentryDsn != null) {
            Sentry.init({
                dsn: config.sentryDsn,
            });
        }
        const app = new App(config);
        return app.run();
    })
    .catch(err => {
        console.error(err);
        Sentry.captureException(err);
        process.exit(1);
    });
