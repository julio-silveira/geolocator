import mongoose from 'mongoose';
import { env } from "../config";

const initDatabase = async function() {
  await mongoose.connect(env.MONGO_URI);
};

export default initDatabase();
