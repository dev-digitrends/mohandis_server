import { connectToDatabase } from "../database/connection";

export function getDatabaseObject(db, host = "localhost:27017") {
  return connectToDatabase(db, host);
}
