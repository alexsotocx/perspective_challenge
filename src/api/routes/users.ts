import { Request, Response, Router } from "express";

export function createUsersRoute(user): Router {
  const router = Router();

  router.post('/', (req: Request, res: Response) => {
    res.send({}).status(201);
  });

  router.get('/', (req: Request, res: Response) => {
    res.send([]).status(200);
  });

  return Router().use('/v1/users', router);
}
