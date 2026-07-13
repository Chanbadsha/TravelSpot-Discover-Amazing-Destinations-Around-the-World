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
    plugins: [admin()],
    user: {
        additionalFields: {
            tag: { type: "string", required: false, defaultValue: "Explorer" },
            bio: { type: "string", required: false },
            yearsExperience: { type: "number", required: false, defaultValue: 0 },
        },
    },
});

export async function getServerSession() {
  const { headers } = await import("next/headers");
  const headersList = await headers();
  return auth.api.getSession({ headers: headersList });
}
