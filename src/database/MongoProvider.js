import { MongoClient } from 'mongodb';

export class MongoProvider {
    constructor() {
        this.collection = null;
    }

    async connect() {
        try {
            const client = new MongoClient('mongodb://localhost:27017');
            await client.connect();
            this.collection = client.db('space_game').collection('players');
            return true;
        } catch (err) {
            return false;
        }
    }

    async saveFuel(playerId, fuel) {
        if (!this.collection) return;
        await this.collection.updateOne(
            { id: playerId },
            { $set: { fuel: fuel, updatedAt: new Date() } },
            { upsert: true }
        );
    }

    async loadFuel(playerId) {
        if (!this.collection) return null;
        const data = await this.collection.findOne({ id: playerId });
        return data ? data.fuel : null;
    }
}