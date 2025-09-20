import { createClient } from "redis";

class RedisService {
    constructor() {
        this.client = null;
    }

    async initialize() {
        if (this.client) return;

        try {
            this.client = createClient({
                url: process.env.REDIS_URI,
            })

            this.client.on("error", (error) => console.error("Redis Client Error", error));

            await this.client.connect();
            console.log("Redis Connected!");

        } catch (error) {
            console.error("Failed to initialize redis", error);
        }
    }

    async disconnect() {
        if (this.client) {
            await this.client.quit();
            this.client = null;
            console.log("Redis disconnected!");
        }
    }
}

export default new RedisService();