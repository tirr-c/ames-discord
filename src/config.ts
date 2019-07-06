import * as fs from 'fs';

import * as dotenv from 'dotenv';

export interface Config {
    token: string;
    graphqlEndpoint: string;
    staticAssetsUrl: string;
    sentryDsn?: string;
    tempChannelId: string;
}

export async function loadFromFile(envPath: string): Promise<Config> {
    const rawEnv = await fs.promises.readFile(envPath);
    const env = dotenv.parse(rawEnv);
    return {
        token: env.AMES_DISCORD_TOKEN,
        graphqlEndpoint: env.AMES_ENDPOINT,
        staticAssetsUrl: env.AMES_STATIC,
        sentryDsn: env.SENTRY_DSN || undefined,
        tempChannelId: env.TEMP_CHANNEL_ID,
    };
}
