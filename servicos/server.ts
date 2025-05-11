import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";

import confeiteiraRouter from "./rota/confeiteira.route";
import catalogoRouter from "./rota/catalogo.router";
import loginConf from "./rota/loginConf.router";

const app = express();
const PORT = Number(process.env.PORT) || 8081;

const allowedOrigins = [
  "http://localhost:3306",
  "http://localhost:3000",
  "http://192.168.100.191:8081",
  "http://localhost:8081",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Origem não permitida pelo CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.options("*", cors());

app.use(express.json());

app.use("/servicos/rota/confeiteira", confeiteiraRouter);
app.use("/servicos/rota/catalogo", catalogoRouter);
app.use("/servicos/rota/loginConf", loginConf);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});