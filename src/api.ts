import express from "express";
import cors from "cors";
import { IConfig } from "./types/config";
import { createUsersRoute } from "./api/routes/users";
import { MongoUsersRepository } from "./repositories/users";


export class Api {
  constructor(private readonly config: IConfig) {
  }

  async start(): Promise<void> {
    const app = express();

    app.use(cors())
      .use(express.json())
      .options("*", cors());

    const usersRepository = new MongoUsersRepository();

    app.use(createUsersRoute(usersRepository));

    app.listen(this.config.http.port, () => {
      console.log(`[server]: Server is running at http://localhost:${this.config.http.port}`);
    });
  }
}
