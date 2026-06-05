import { Member, Lane } from "./member";

export interface Team {
    teamId: number; // 1-10
    members: string[]; // array of member IDs
    lane?: Lane | null;
    name?: string;
}

export interface Division {
    divisionId: 1 | 2;
    teams: Team[];
}

export interface Formation {
    _id?: string;
    guildId: string;
    guildMembersId: string;
    name: string;
    divisions: Division[];
    laneNames?: Record<Lane, string>;
    createdAt?: Date;
    updatedAt?: Date;
    shareToken?: string;
}

export interface GuildMembers {
    _id?: string;
    guildId: string;
    name: string;
    members: Member[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Guild {
    _id?: string;
    name: string;
    ownerId?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export type TeamHealthIssue =
    | "no-tank"
    | "no-healer"
    | "too-many-dps"
    | "under-capacity"
    | "over-capacity";

export interface TeamHealth {
    teamId: number;
    issues: TeamHealthIssue[];
    memberCount: number;
}