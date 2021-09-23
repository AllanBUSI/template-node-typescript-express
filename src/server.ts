require("dotenv").config();
// récupérer les chemins alias une fois le projet déployé
if (process.env.NODE_ENV === "production") {
  require("module-alias/register");
}
import express, { Application } from "express";
import helmet from "helmet";
import http from "http";
import cors from "cors";
import morgan from "morgan";
import databaseManager from "./database";

// cache
declare global {
  var myCache: NodeCache;
}
import NodeCache from "node-cache";
import router from "./routes";
import { errorLogger, logger } from "@config/winston";
import Socket from "./Socket";
import Mailer from "@utils/Mailer";
import nodemailer from "nodemailer";

import smtpTransport from "nodemailer-smtp-transport";

global.myCache = new NodeCache();

const app: Application = express();
const httpServer = http.createServer(app);
const PORT = process.env.PORT || 5000;

app.use(require("express-status-monitor")());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet());
app.use(morgan("combined", { stream: logger.stream }));
app.use(
  cors({
    credentials: true,
    origin: "*",
  })
);

// routes de l'api
app.use(router);



(async () => {
  // const mailer = new Mailer(null, null, null, null);
  try {
    httpServer.listen(PORT);
    Socket(httpServer);
    console.log(`Serveur lancé sur le port ${PORT}`);

    //CONNEXION NODEMAILER
    const isConnected = async function connect() {
      try {
        return await nodemailer.createTransport(smtpTransport({
          service: "gmail",
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT),
          secure: true, // upgrade later with STARTTLS
          // tls: {
          //   ciphers: "SSLv3",
          // },
          requireTLS: true,
          greetingTimeout: 5000,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
          },
        })).verify();
      } catch (error) {
        errorLogger.error(`${error.status || 500} - [src/utils/Mailer ()=> connect] - ${error.message}`);
        console.log("Erreur lors de la connexion Nodemailer : " + error);
        return false;
      } 
    }
    if (!isConnected) {
      throw new Error("Connexion avec Nodemailer impossible");
    }
    console.log("Nodemailer connecté");

    // CONNEXION BASE DE DONNEES
    const dbConnected = await (await databaseManager.getManager()).connection.isConnected;
    if (!dbConnected) {
      throw new Error("Base de données non connectée");
    }
    console.log("Base de données connectée");
  } catch (error) {
    errorLogger.error(`${error.status || 500} - [src/server] - ${error.message}`);
    console.log("error: ", error);
  }
  // fermeture de la connexion
  //mailer.close();
})();
