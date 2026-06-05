import { connectToDatabase } from "../mongodb";
import { GuildMembers, Member } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { ObjectId } from "mongodb";

export async function createGuildMembers(
    guildId: string,
    name: string,
    memberNames: string[]
): Promise<GuildMembers> {
    const client = await connectToDatabase();
    if (!client) throw new Error("Failed to connect to database");
    const db = client.db();

    const members: Member[] = memberNames.map((name) => ({
        id: uuidv4(),
        name: name.trim(),
        class: null,
        lane: null,
        tags: [],
        notes: "",
    }));

    const guildMembers = {
        guildId,
        name,
        members,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const result = await db.collection("guild_members").insertOne(guildMembers);

    return {
        ...guildMembers,
        _id: result.insertedId.toString(),
    };
}

export async function getGuildMembers(id: string): Promise<GuildMembers | null> {
    const client = await connectToDatabase();
    if (!client) throw new Error("Failed to connect to database");
    const db = client.db();

    const guildMembers = await db.collection("guild_members").findOne({ _id: new ObjectId(id) });

    if (!guildMembers) return null;

    return { ...guildMembers, _id: guildMembers._id.toString() } as unknown as GuildMembers;
}

export async function updateMember(
    guildMembersId: string,
    memberId: string,
    updates: Partial<Member>
): Promise<void> {
    const client = await connectToDatabase();
    if (!client) throw new Error("Failed to connect to database");
    const db = client.db();

    await db.collection("guild_members").updateOne(
        { _id: new ObjectId(guildMembersId), "members.id": memberId },
        {
            $set: {
                "members.$": updates,
                updatedAt: new Date(),
            },
        }
    );
}

export async function removeMember(guildMembersId: string, memberId: string): Promise<void> {
    const client = await connectToDatabase();
    if (!client) throw new Error("Failed to connect to database");
    const db = client.db();

    await db.collection("guild_members").updateOne(
        { _id: new ObjectId(guildMembersId) },
        {
            $pull: { members: { id: memberId } },
            $set: { updatedAt: new Date() },
        } as any
    );
}