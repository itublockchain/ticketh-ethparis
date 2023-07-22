import dotenv from "dotenv";
import { makeApp } from "./app";
import { utils } from "ethers";
dotenv.config();

const getEnv = (key: string): string => {
    const value = process.env[key];
    if (value == undefined) throw new Error(`Env variables missing: ${key}`);
    return value;
};

const signer = new utils.SigningKey(getEnv("SERVER_PRIVATE_KEY"));
const basePath = "/";
const app = makeApp(signer, basePath);
const port = process.env.PORT || 3668;
app.listen(port);

console.log(`Listening to http://127.0.0.1:3668/`);
