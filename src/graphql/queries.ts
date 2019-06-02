import { gql } from 'apollo-boost';
import { Query } from './types';

export interface CharacterInfoResponse {
    characterProfile: {
        id: number;
        name: string;
        age: number | null;
        race: string;
        height: number | null;
        weight: number | null;
        bloodType: string;
        favorite: string;
        voice: string;
        unit: {
            rarity: number;
            comment: string;
        };
    } | null;
}

export const CharacterInfo: Query<CharacterInfoResponse, { name: string }> = {
    query: gql`
        query GetCharacterInfo($name: String!) {
            characterProfile(name: $name) {
                id
                name
                age
                race
                height
                weight
                bloodType
                favorite
                voice
                unit {
                    rarity
                    comment
                }
            }
        }
    `,
};
