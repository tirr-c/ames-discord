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
}
