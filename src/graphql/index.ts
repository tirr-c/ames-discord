import ApolloClient, { ApolloQueryResult } from 'apollo-boost';
import fetch from 'node-fetch';
import { Config } from '../config';
import { Query } from './types';
import * as queries from './queries';

export default class GraphQlClient {
    private client: ApolloClient<any>;

    constructor(config: Config) {
        this.client = new ApolloClient({
            uri: config.graphqlEndpoint,
            fetch: fetch as any,
        });
    }

    query<Response, Variable>(
        queryObj: Query<Response, Variable>,
        variables: Variable,
    ): Promise<ApolloQueryResult<Response>> {
        return this.client.query<Response, Variable>({
            query: queryObj.query,
            variables,
        })
    }

    getCharacterInfo(name: string) {
        return this.query(queries.CharacterInfo, { name });
    }

    getCharacterStat(name: string, rarity: number, rank: number) {
        return this.query(queries.CharacterStat, { name, rarity, rank });
    }

    getNearestBirthdayFrom(month: number, day: number) {
        return this.query(queries.NearestBirthdayFrom, { month, day });
    }

    async getTodayBirthday() {
        const today = new Date();
        const tzAdjust = today.getTimezoneOffset() + 540;
        today.setMinutes(today.getMinutes() + tzAdjust);

        const month = today.getMonth() + 1;
        const day = today.getDate();
        const nearest = await this.getNearestBirthdayFrom(month, day);
        if (nearest.data.result.birthMonth === month && nearest.data.result.birthDay === day) {
            return {
                id: nearest.data.result.id,
                name: nearest.data.result.name,
            };
        }
        return null;
    }
}
