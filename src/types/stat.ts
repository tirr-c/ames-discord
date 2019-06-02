export interface Stat {
    hp: number;
    atk: number;
    magicStr: number;
    def: number;
    magicDef: number;
    physicalCritical: number;
    magicCritical: number;
    waveHpRecovery: number;
    waveEnergyRecovery: number;
    dodge: number;
    lifeSteal: number;
    hpRecoveryRate: number;
    energyRecoveryRate: number;
    energyReduceRate: number;
    accuracy: number;
}

export const STAT_MAP: { [key in keyof Stat]: string } = {
    hp: 'HP',
    atk: '물리 공격력',
    magicStr: '마법 공격력',
    def: '물리 방어력',
    magicDef: '마법 방어력',
    physicalCritical: '물리 크리티컬',
    magicCritical: '마법 크리티컬',
    waveHpRecovery: 'HP 자동 회복',
    waveEnergyRecovery: 'TP 자동 회복',
    dodge: '회피',
    lifeSteal: 'HP 흡수',
    hpRecoveryRate: '회복량 증가',
    energyRecoveryRate: 'TP 상승',
    energyReduceRate: 'TP 소비 감소',
    accuracy: '명중',
};

export const STAT_KEYS: (keyof Stat)[] = [
    'hp', 'atk', 'magicStr', 'def', 'magicDef', 'physicalCritical', 'magicCritical',
    'waveHpRecovery', 'waveEnergyRecovery', 'dodge', 'lifeSteal', 'hpRecoveryRate',
    'energyRecoveryRate', 'energyReduceRate', 'accuracy',
];

// ax + b
export function fusedMultiplyAdd(a: Stat, x: number, b: Stat): Stat {
    const result: any = {};
    for (const key of STAT_KEYS) {
        result[key] = a[key] * x + b[key];
    }
    return result as Stat;
}
