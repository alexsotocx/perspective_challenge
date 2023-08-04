import * as dotenv from "dotenv";
import { Api } from "../api";
import { IConfig } from "../types/config";



async function startApi(): Promise<void> {
  dotenv.config();
  const config: IConfig = {
    http: {
      port: parseInt(process.env.PORT) || 9000,
    }
  }
  const api = new Api(config);

  await api.start();
}

void startApi();
