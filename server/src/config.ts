import env from "env-var";

export const config = {
  port: env.get("PORT").default("8000").asPortNumber(),
  mongoUrl: env.get("MONGO_URL").required().asString(),
  nodeEnv: env.get("NODE_ENV").default("development").asString(),
};
