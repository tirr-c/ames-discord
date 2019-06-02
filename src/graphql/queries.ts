import { gql } from 'apollo-boost';
import { Stat } from '../types/stat';
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

export interface CharacterStatResponse {
    characterProfile: {
        id: number;
        unit: {
            stat: {
                base: Stat;
                growthRate: Stat;
            } | null;
            statByRank: Stat | null;
        };
    } | null;
}

export const CharacterStat: Query<CharacterStatResponse, { name: string; rarity: number; rank: number }> = {
    query: gql`
        query GetCharacterStat($name: String!, $rarity: Int!, $rank: Int!) {
            characterProfile(name: $name) {
                id
                unit {
                    stat(rarity: $rarity) {
                        base {
                            hp
                            atk
                            magicStr
                            def
                            magicDef
                            physicalCritical
                            magicCritical
                            waveHpRecovery
                            waveEnergyRecovery
                            dodge
                            lifeSteal
                            hpRecoveryRate
                            energyRecoveryRate
                            energyReduceRate
                            accuracy
                        }
                        growthRate {
                            hp
                            atk
                            magicStr
                            def
                            magicDef
                            physicalCritical
                            magicCritical
                            waveHpRecovery
                            waveEnergyRecovery
                            dodge
                            lifeSteal
                            hpRecoveryRate
                            energyRecoveryRate
                            energyReduceRate
                            accuracy
                        }
                    }
                    statByRank(rank: $rank) {
                        hp
                        atk
                        magicStr
                        def
                        magicDef
                        physicalCritical
                        magicCritical
                        waveHpRecovery
                        waveEnergyRecovery
                        dodge
                        lifeSteal
                        hpRecoveryRate
                        energyRecoveryRate
                        energyReduceRate
                        accuracy
                    }
                }
            }
        }
    `,
};
