import { connectToDatabase } from "../mongodb";
import { Formation, Division } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { ObjectId } from "mongodb";

export async function createFormation(
    guildId: string,
    guildMembersId: string,
    name: string
): Promise<Formation> {
    const client = await connectToDatabase();
    if (!client) {
        throw new Error("Failed to connect to database");
    }
    const db = client.db();

    // Initialize empty 10 teams across 2 divisions
    const divisions: Division[] = [
        {
            divisionId: 1,
            teams: [
                { teamId: 1, members: [] },
                { teamId: 2, members: [] },
                { teamId: 3, members: [] },
                { teamId: 4, members: [] },
                { teamId: 5, members: [] },
            ],
        },
        {
            divisionId: 2,
            teams: [
                { teamId: 6, members: [] },
                { teamId: 7, members: [] },
                { teamId: 8, members: [] },
                { teamId: 9, members: [] },
                { teamId: 10, members: [] },
            ],
        },
    ];

    const formation = {
        guildId,
        guildMembersId,
        name,
        divisions,
        shareToken: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const result = await db.collection("formations").insertOne(formation);

    return {
        ...formation,
        _id: result.insertedId.toString(),
    };
}

export async function getFormation(id: string): Promise<Formation | null> {
    const client = await connectToDatabase();
    if (!client) throw new Error("Failed to connect to database");
    const db = client.db();

    const formation = await db.collection("formations").findOne({ _id: new ObjectId(id) });

    if (!formation) return null;

    return { ...formation, _id: formation._id.toString() } as unknown as Formation;
}

export async function getFormationByShareToken(token: string): Promise<Formation | null> {
    const client = await connectToDatabase();
    if (!client) throw new Error("Failed to connect to database");
    const db = client.db();

    const formation = await db.collection("formations").findOne({ shareToken: token });

    if (!formation) return null;

    return { ...formation, _id: formation._id.toString() } as unknown as Formation;
}

export async function updateFormation(
    id: string,
    divisions: Division[]
): Promise<void> {
    const client = await connectToDatabase();
    if (!client) throw new Error("Failed to connect to database");
    const db = client.db();

    await db.collection("formations").updateOne(
        { _id: new ObjectId(id) },
        {
            $set: {
                divisions,
                updatedAt: new Date(),
            },
        }
    );
}

export async function assignMemberToTeam(
    formationId: string,
    teamId: number,
    memberId: string
): Promise<void> {
    const client = await connectToDatabase();
    if (!client) throw new Error("Failed to connect to database");
    const db = client.db();

    // Remove member from all teams first
    await db.collection("formations").updateOne(
        { _id: new ObjectId(formationId) },
        {
            $pull: {
                "divisions.$[].teams.$[].members": memberId,
            },
        } as any
    );

    // Add to the specified team
    await db.collection("formations").updateOne(
        { _id: new ObjectId(formationId), "divisions.teams.teamId": teamId },
        {
            $push: {
                "divisions.$[div].teams.$[team].members": memberId,
            },
            $set: {
                updatedAt: new Date(),
            },
        } as any,
        {
            arrayFilters: [
                { "div.teams.teamId": teamId },
                { "team.teamId": teamId },
            ],
        } as any
    );
}

export async function removeMemberFromTeam(
    formationId: string,
    memberId: string
): Promise<void> {
    const client = await connectToDatabase();
    if (!client) throw new Error("Failed to connect to database");
    const db = client.db();

    await db.collection("formations").updateOne(
        { _id: new ObjectId(formationId) },
        {
            $pull: {
                "divisions.$[].teams.$[].members": memberId,
            },
            $set: {
                updatedAt: new Date(),
            },
        } as any
    );
}