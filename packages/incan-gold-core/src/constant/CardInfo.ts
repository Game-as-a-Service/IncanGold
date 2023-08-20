interface Artifact {
    name: string;
    points: number;
}

type Id = string;
type points = number;

const artifactName: string[] = ['杯子', '雞蛋糕模具', '金輪', '派大星', '黑暗大法師'];

export const artifactCards: Record<Id, Artifact> = {
    "A1": { "name": artifactName[0], "points": 5 },
    "A2": { "name": artifactName[1], "points": 7 },
    "A3": { "name": artifactName[2], "points": 8 },
    "A4": { "name": artifactName[3], "points": 10 },
    "A5": { "name": artifactName[4], "points": 12 },
}

export const treasureCards: Record<Id, points> = {
    "T1": 1,
    "T2": 2,
    "T3": 3,
    "T4": 4,
    "T5(1)": 5,
    "T5(2)": 5,
    "T7(1)": 7,
    "T7(2)": 7,
    "T9": 9,
    "T11(1)": 11,
    "T11(2)": 11,
    "T13": 13,
    "T14": 14,
    "T15": 15,
    "T17": 17
}

// Hazard Card
export const hazardNames = ["fire", "rocks", "mummy", "python", "spiders"];
export const hazardCards: Record<Id, string> = {
    "HF1": "fire",
    "HF2": "fire",
    "HF3": "fire",
    "HR1": "rocks",
    "HR2": "rocks",
    "HR3": "rocks",
    "HM1": "mummy",
    "HM2": "mummy",
    "HM3": "mummy",
    "HP1": "python",
    "HP2": "python",
    "HP3": "python",
    "HS1": "spiders",
    "HS2": "spiders",
    "HS3": "spiders",
}

Object.freeze(artifactCards);
Object.freeze(treasureCards);
Object.freeze(hazardCards);
Object.freeze(hazardNames);