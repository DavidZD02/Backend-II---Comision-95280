import "dotenv/config";

const requiredEnvVars = ["MONGO_URL", "JWT_SECRET"];

const missing = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missing.length > 0) {
  console.error(
    `Error: faltan las siguientes variables de entorno: ${missing.join(", ")}`,
  );
  process.exit(1);
}

export const env = {
  PORT: Number(process.env.PORT) || 8080,
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGO_URL: process.env.MONGO_URL,
  JWT_SECRET: process.env.JWT_SECRET,
};
