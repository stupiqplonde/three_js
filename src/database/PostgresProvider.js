import pg from 'pg';
const { Pool } = pg;

export class PostgresProvider {
    constructor(connectionString) {
        this.connectionString = connectionString;
        this.pool = null;
    }

    async connect() {
        try {
            this.pool = new Pool({ 
                connectionString: this.connectionString,
                ssl: this.connectionString.includes('render.com') ? { rejectUnauthorized: false } : false
            });
            
            // Создаем таблицу если нет
            await this.pool.query(`
                CREATE TABLE IF NOT EXISTS players (
                    id TEXT PRIMARY KEY,
                    fuel INTEGER DEFAULT 100,
                    updated_at TIMESTAMP DEFAULT NOW()
                )
            `);
            return true;
        } catch (err) {
            return false;
        }
    }

    async saveFuel(playerId, fuel) {
        if (!this.pool) return;
        await this.pool.query(
            `INSERT INTO players (id, fuel, updated_at) 
             VALUES ($1, $2, NOW())
             ON CONFLICT (id) 
             DO UPDATE SET fuel = $2, updated_at = NOW()`,
            [playerId, fuel]
        );
    }

    async loadFuel(playerId) {
        if (!this.pool) return null;
        const result = await this.pool.query('SELECT fuel FROM players WHERE id = $1', [playerId]);
        return result.rows[0]?.fuel ?? null;
    }
} 