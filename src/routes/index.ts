import express, { Express } from "express";

const useRoutes = (app: Express) => {
  const router = express.Router();

  app.use("/api", router);
};

export default useRoutes;
