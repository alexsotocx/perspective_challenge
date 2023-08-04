import express from "express";
import cors from "cors";
import { IConfig } from "./types/config";
import { createUsersRoute } from "./api/handlers/users";


export class Api {
  constructor(private readonly config: IConfig) {
  }

  async start(): Promise<void> {
    const app = express();

    app.use(cors())
      .use(express.json())
      .options("*", cors());

    app.use(createUsersRoute());

    app.listen(this.config.http.port, () => {
      console.log(`[server]: Server is running at http://localhost:${this.config.http.port}`);
    });
  }
}
