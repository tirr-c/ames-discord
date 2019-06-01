import * as Discord from 'discord.js';
import { Config } from './config';
import GraphQlClient from './graphql';

export default class App {
    private client: Discord.Client;
    private graphql: GraphQlClient;

    constructor(private config: Config) {
        const client = new Discord.Client();
        client.on('ready', () => {
            console.log('Bot ready');
        });
        client.on('error', err => {
            console.error(err);
        });

        this.client = client;
        this.graphql = new GraphQlClient(config);
    }

    async run() {
        await this.client.login(this.config.token);
    }

    async sendCharacterInfoByName(channel: Discord.TextChannel, name: string) {
        const { data: characterInfo } = await this.graphql.getCharacterInfo(name);

        const embed = new Discord.RichEmbed();
        embed.setTitle(characterInfo.characterUnit.name);
        embed.setDescription(characterInfo.characterUnit.comment);
        embed.addField('레어도', `★${characterInfo.characterUnit.rarity}`, true);
        await channel.send(embed);
    }
}
