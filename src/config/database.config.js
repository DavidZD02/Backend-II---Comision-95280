import mongoose from "mongoose";
import { env } from "./env.config.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGO_URL);
    console.log("Conexión a MongoDB exitosa");
  } catch (error) {
    console.error("Error al conectar con MongoDB:", error.message);
    process.exit(1);
  }
};
 