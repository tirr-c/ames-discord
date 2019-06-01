import * as path from 'path';
import App from './app';
import * as config from './config';

const envPath = process.argv[2] || '.env';
config.loadFromFile(path.resolve(envPath))
    .then(config => new App(config))
    .then(app => app.run())
    .catch(console.error);
