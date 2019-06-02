import { URL } from 'url';

import * as Sentry from '@sentry/node';
import * as Discord from 'discord.js';

import { Config } from './config';
import GraphQlClient from './graphql';
import * as Stat from './types/stat';

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

        {
            const result = /^프리코네 (.*) 스탯$/.exec(content);
            if (result != null) {
                const rawArgs = result[1].trim().split(' ').filter(val => val !== '');
                const args = {
                    name: '',
                    rarity: 1,
                    rank: 1,
                    level: 1,
                };
                for (const arg of rawArgs) {
                    if (arg.startsWith('랭크')) {
                        const val = arg.substring(2);
                        const parsed = Number(val);
                        if (!Number.isInteger(parsed)) {
                            await message.channel.send(`:x: 랭크 ${val}`);
                            return;
                        }
                        args.rank = parsed;
                    } else if (arg.endsWith('랭')) {
                        const val = arg.substring(0, arg.length - 1);
                        const parsed = Number(val);
                        if (!Number.isInteger(parsed)) {
                            await message.channel.send(`:x: 랭크 ${val}`);
                            return;
                        }
                        args.rank = parsed;
                    } else if (arg.endsWith('성')) {
                        const val = arg.substring(0, arg.length - 1);
                        const parsed = Number(val);
                        if (!Number.isInteger(parsed)) {
                            await message.channel.send(`:x: ★${val}`);
                            return;
                        }
                        args.rarity = parsed;
                    } else if (arg.endsWith('레벨')) {
                        const val = arg.substring(0, arg.length - 2);
                        const parsed = Number(val);
                        if (!Number.isInteger(parsed)) {
                            await message.channel.send(`:x: Lv. ${val}`);
                            return;
                        }
                        args.level = parsed;
                    } else if (arg.endsWith('렙')) {
                        const val = arg.substring(0, arg.length - 1);
                        const parsed = Number(val);
                        if (!Number.isInteger(parsed)) {
                            await message.channel.send(`:x: Lv. ${val}`);
                            return;
                        }
                        args.level = parsed;
                    } else if (args.name !== '') {
                        await message.channel.send(`:x: 여러 번 주어진 이름 (${arg})`);
                        return;
                    } else {
                        args.name = arg;
                    }
                }
                if (args.name === '') {
                    await message.channel.send(`:x: 이름이 없음`);
                    return;
                }
                await this.sendCharacterStat(message.channel, args);
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

    async sendCharacterStat(channel: SendableChannel, args: { name: string; rarity: number; rank: number; level: number }) {
        const { name, rarity, rank, level } = args;
        const { data: { characterProfile } } = await this.graphql.getCharacterStat(name, rarity, rank);
        if (characterProfile == null) {
            await channel.send(`:x: ${name}`);
            return;
        }

        const { id, unit: { stat, statByRank } } = characterProfile;
        if (stat == null) {
            await channel.send(`:x: ${name} ★${rarity}`);
            return;
        }
        if (statByRank == null) {
            await channel.send(`:x: ${name} 랭크 ${rank}`);
            return;
        }

        const { base, growthRate } = stat;
        const result = Stat.fusedMultiplyAdd(
            statByRank,
            1,
            Stat.fusedMultiplyAdd(growthRate, rank + level, base),
        );

        const embed = new Discord.RichEmbed();
        embed.setTitle(`${name} ★${rarity} RANK${rank} Lv. ${level}`);
        embed.setThumbnail(
            new URL(
                `icons/unit/${id + (rarity >= 3 ? 30 : 10)}.png`,
                this.config.staticAssetsUrl,
            ).toString(),
        );
        for (const [key, label] of Object.entries(Stat.STAT_MAP)) {
            embed.addField(label, String(Math.floor((result as any)[key])), true);
        }
        await channel.send(embed);
    }
}
