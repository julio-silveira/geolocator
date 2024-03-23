import mongoose from "mongoose";
import app from "./app";
import { env } from "./config";

async function startServer() {
  console.log("Starting server...");
  await mongoose.connect(env.MONGO_URI);
  console.log("Connected to database"); 

  app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
  });
} 


startServer();