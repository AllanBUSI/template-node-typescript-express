require("dotenv").config();
import { Connection, ConnectionManager, createConnection, EntityManager, getConnectionManager, getConnectionOptions, QueryRunner } from "typeorm";

/**
 * Database manager class
 */
class DatabaseManager {
  private connectionManager: ConnectionManager;
  private DEFAULT_CONNECTION_NAME = "default";
  private hasCreatedConnection = false;

  constructor() {
    this.connectionManager = getConnectionManager();
  }

  private async getConnection(): Promise<Connection> {
    const currentConnection = this.connectionManager.has(this.DEFAULT_CONNECTION_NAME)
      ? this.connectionManager.get(this.DEFAULT_CONNECTION_NAME)
      : undefined;
    // if connection exists but we don't remember creating it, it's because of hot reloading
    // and that means a new connection needs to be created, or else entity metadata won't match
    // from the old session.
    // https://stackoverflow.com/questions/60677582/entitymetadatanotfound-no-metadata-for-businessapplication-was-found
    if (currentConnection && !this.hasCreatedConnection) {
      // console.debug("recreating connection due to hot reloading");
      if (currentConnection.isConnected) {
        await currentConnection.close();
      }
      // console.debug("done closing, making new connection..");
      return this.createConnection();
    }
    if (currentConnection) {
      // console.debug("return currentConnexion");
      if (!currentConnection.isConnected) {
        // console.debug("currentConnexion connect");
        return currentConnection.connect();
      } else return currentConnection;
    } else {
      return this.createConnection();
    }
  }

  private async createConnection(): Promise<Connection> {
    this.hasCreatedConnection = true;
    const connectionOptions = await getConnectionOptions();
    const options: any = {
      ...connectionOptions,
      entities: [
        //entité
      ],

      name: this.DEFAULT_CONNECTION_NAME,
      extra: { connectionLimit: 25, devTimeout: 15000 },
      maxQueryExecutionTime: 5000,
    };
    // console.debug("createConnexion");
    const conn = await createConnection(options);
    return conn;
  }

  public async getManager(): Promise<EntityManager> {
    const conn = await this.getConnection();
    return conn.manager;
  }

  public async getQuerryRunner(): Promise<QueryRunner> {
    const conn = await this.getConnection();
    return conn.createQueryRunner();
  }

  public async closeConnection(): Promise<void> {
    const conn = await this.getConnection();
    await conn.close();
  }
}

const databaseManager = new DatabaseManager();
export default databaseManager;
