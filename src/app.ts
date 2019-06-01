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
        const { characterUnit } = characterInfo;
        if (characterUnit == null) {
            await channel.send(`:x: ${name}`);
            return;
        }

        const embed = new Discord.RichEmbed();
        embed.setTitle(characterUnit.name);
        embed.setDescription(characterUnit.comment.replace(/\\n/g, ' '));
        embed.setThumbnail(
            new URL(
                `icons/unit/${characterUnit.id + 10}.png`,
                this.config.staticAssetsUrl,
            ).toString(),
        );
        embed.addField('레어도', `★${characterUnit.rarity}`, true);
        await channel.send(embed);
    }
}
