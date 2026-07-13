import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin } from "better-auth/plugins/admin";

const client = new MongoClient(process.env.MONGODB_URI as string)
const db = client.db(process.env.MONGODB_DB as string)
export const auth = betterAuth({
    database: mongodbAdapter(db, {
        client
    }),
    emailAndPassword: {
        enabled: true,
    },
    plugins: [admin()]
});
