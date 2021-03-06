import * as fs from 'fs';

import * as dotenv from 'dotenv';

export interface Config {
    token: string;
    graphqlEndpoint: string;
    staticAssetsUrl: string;
    sentryDsn?: string;
    tempChannelId: string;
}

export async function loadFromFile(envPath?: string): Promise<Config> {
    let env: { [key: string]: string } = {};
    if (envPath != null) {
        const rawEnv = await fs.promises.readFile(envPath);
        env = dotenv.parse(rawEnv);
    }
    return {
        token: env.AMES_DISCORD_TOKEN || process.env.AMES_DISCORD_TOKEN || '',
        graphqlEndpoint: env.AMES_ENDPOINT || process.env.AMES_ENDPOINT || '',
        staticAssetsUrl: env.AMES_STATIC || process.env.AMES_STATIC || '',
        sentryDsn: env.SENTRY_DSN || process.env.SENTRY_DSN || undefined,
        tempChannelId: env.TEMP_CHANNEL_ID || process.env.TEMP_CHANNEL_ID || '',
    };
}
