import * as fs from 'fs';

import * as dotenv from 'dotenv';

export interface Config {
    token: string;
}

export async function loadFromFile(envPath: string): Promise<Config> {
    const rawEnv = await fs.promises.readFile(envPath);
    const env = dotenv.parse(rawEnv);
    return {
        token: env.AMES_DISCORD_TOKEN,
    };
}
