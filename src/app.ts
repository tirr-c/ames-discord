import * as Discord from 'discord.js';
import { Config } from './config';

export async function run(config: Config): Promise<Discord.Client> {
    const client = new Discord.Client();
    client.on('ready', () => {
        console.log('Bot ready');
    });
    client.on('error', err => {
        console.error(err);
    });
    await client.login(config.token);
    return client;
}
