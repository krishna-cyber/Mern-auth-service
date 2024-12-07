import mongoose from "mongoose";

async function closeDatabaseConnection() {
  return await mongoose.connection.close();
}

async function connectToDatabase() {
  return await mongoose.connect(process.env.MONGO_URI_ATLAS as string);
}

function isJWT(token: string | null): boolean {
  if (token) {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return false;
    }
    return true;
  }
  return false;
}

export { connectToDatabase, closeDatabaseConnection, isJWT };
