import { MongoProvider } from './MongoProvider.js';
import { PostgresProvider } from './PostgresProvider.js';

class DatabaseManager {
    constructor() {
        this.db = null; // хранит текущий провайдер
    }

    // MongoDB
    async useMongo() {
        this.db = new MongoProvider();
        return await this.db.connect();
    }

    // PostgreSQL
    async usePostgres(connectionString) {
        this.db = new PostgresProvider(connectionString);
        return await this.db.connect();
    }

    // Сохранить топливо
    async saveFuel(playerId, fuel) {
        if (this.db) {
            await this.db.saveFuel(playerId, fuel);
        }
    }

    // Загрузить топливо
    async loadFuel(playerId) {
        if (this.db) {
            return await this.db.loadFuel(playerId);
        }
        return null;
    }
}

export const dbManager = new DatabaseManager();