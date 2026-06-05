import { connectToDatabase } from "../mongodb";
import { Guild } from "@/types";
import { ObjectId } from "mongodb";

export async function createGuild(name: string, ownerId?: string): Promise<Guild> {
    const client = await connectToDatabase();
    if (!client) throw new Error("Failed to connect to database");
    const db = client.db();

    const guild = {
        name,
        ownerId,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const result = await db.collection("guilds").insertOne(guild);

    return {
        ...guild,
        _id: result.insertedId.toString(),
    };
}

export async function getGuild(id: string): Promise<Guild | null> {
    const client = await connectToDatabase();
    if (!client) throw new Error("Failed to connect to database");
    const db = client.db();

    const guild = await db.collection("guilds").findOne({ _id: new ObjectId(id) });

    if (!guild) return null;

    return { ...guild, _id: guild._id.toString() } as unknown as Guild;
}
