import * as Sentry from '@sentry/node';
import * as Discord from 'discord.js';

import { Config } from './config';
import GraphQlClient from './graphql';

type SendableChannel = Discord.TextChannel | Discord.DMChannel | Discord.GroupDMChannel;

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
            Sentry.captureException(err);
        });
        client.on('message', message => {
            this.processMessage(message)
                .catch(err => {
                    console.error(err);
                    Sentry.captureException(err);
                });
        });

        this.client = client;
        this.graphql = new GraphQlClient(config);
    }

    async run() {
        await this.client.login(this.config.token);
    }

    private async processMessage(message: Discord.Message) {
        const content = message.content;
        if (content.startsWith('프리코네 캐릭터 ')) {
            const name = content.substring(9).trim();
            if (name !== '') {
                await this.sendCharacterInfoByName(message.channel, name);
                return;
            }
        }
    }

    async sendCharacterInfoByName(channel: SendableChannel, name: string) {
        const { data: characterInfo } = await this.graphql.getCharacterInfo(name);
        const { characterProfile } = characterInfo;
        if (characterProfile == null) {
            await channel.send(`:x: ${name}`);
            return;
        }

        const embed = new Discord.RichEmbed();
        embed.setTitle(characterProfile.name);
        embed.setDescription(characterProfile.unit.comment.replace(/\\n/g, ' '));
        embed.setThumbnail(
            new URL(
                `icons/unit/${characterProfile.id + 10}.png`,
                this.config.staticAssetsUrl,
            ).toString(),
        );
        embed.addField('레어도', `★${characterProfile.unit.rarity}`, true);
        embed.addField('나이', characterProfile.age == null ? '알 수 없음' : `${characterProfile.age}세`, true);
        embed.addField('종족', characterProfile.race, true);
        embed.addField('키', characterProfile.height == null ? '알 수 없음' : `${characterProfile.height}cm`, true);
        embed.addField('몸무게', characterProfile.weight == null ? '알 수 없음' : `${characterProfile.weight}kg`, true);
        embed.addField('혈액형', characterProfile.bloodType === '?' ? '알 수 없음' : `${characterProfile.bloodType}형`, true);
        embed.addField('취미', characterProfile.favorite, true);
        embed.addField('성우', characterProfile.voice, true);
        await channel.send(embed);
    }
}
