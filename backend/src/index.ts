import http from 'http';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import Transaction from './db/entity/Transaction';
// import 'reflect-metadata'; // We need this in order to use @Decorators
// import "reflect-metadata";
import env from './loaders/env';
import expressLoader from './loaders/express';

const main = async () => {
  try {
    const connection = await createConnection();
    console.log('Testing database connection...');
    const transactionModel = connection.getRepository(Transaction);
    const transaction = await transactionModel.findOne({ select: ['id'] });
    console.log('Transaction checked:', transaction);

    // load app
    const app = expressLoader();

    const httpServer = http.createServer(app);
    httpServer.listen(env.PORT);

    // I THINK I WONT NEED THIS, CAUSE NGINX WILL HANDLE SSL
    // if (env.MODE === "development") {
    //   const httpServer = http.createServer(app);
    //   httpServer.listen(env.PORT);
    // } else {
    //   const privateKey = fs.readFileSync(
    //     path.resolve(env.SSL_PATH, "privkey.pem"),
    //     "utf8"
    //   );
    //   const certificate = fs.readFileSync(
    //     path.resolve(env.SSL_PATH, "fullchain.pem"),
    //     "utf8"
    //   );
    //   const credentials = { key: privateKey, cert: certificate };
    //   const httpsServer = https.createServer(credentials, app);
    //   httpsServer.listen(env.PORT);
    // }

    console.log(`
      ################################################
      #        Server listening on port: ${env.PORT}      #
      ################################################
    `);
  } catch (error) {
    console.log('ERRO', error);
  }
};

main();
