import { gql } from 'apollo-boost';
import { Query } from './types';

export interface CharacterInfoResponse {
    characterUnit: {
        id: number;
        name: string;
        rarity: number;
        comment: string;
    };
}

export const CharacterInfo: Query<CharacterInfoResponse, { name: string }> = {
    query: gql`
        query GetCharacterInfo($name: String!) {
            characterUnit(name: $name) {
                id
                name
                rarity
                comment
            }
        }
    `,
};
