import dotenv from "dotenv";

// Set the MODE to 'development' by default
process.env.MODE = process.env.MODE || "development";

const envFound = dotenv.config();
if (!envFound) {
  throw new Error("ERRO! Arquivo .env não encontrado.");
}

const env = {
  PORT: parseInt(!process.env.PORT ? "3002" : process.env.PORT),
  JWT_SECRET: String(process.env.JWT_SECRET),
  SSL_PATH: String(process.env.SSL_PATH),
  MODE: String(process.env.MODE),
};

export default env;
