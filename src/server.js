import { env } from "./config/env.config.js";
import { connectDB } from "./config/database.config.js";
import app from "./app.js";

await connectDB();

app.listen(env.PORT, () => {
  console.log(
    `Servidor corriendo en http://localhost:${env.PORT} (${env.NODE_ENV})`,
  );
});
