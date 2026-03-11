import { MongoClient } from "mongodb"

const mongoUri = process.env.MONGO_URI

if (!mongoUri) {
  throw new Error("MONGO_URI is not defined")
}

const client = new MongoClient(mongoUri)

const db = client.db("appointments_db")

export default db
