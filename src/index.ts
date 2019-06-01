import * as path from 'path';
import { run } from './app';
import * as config from './config';

const envPath = process.argv[2] || '.env';
config.loadFromFile(path.resolve(envPath))
    .then(run)
    .catch(console.error);
