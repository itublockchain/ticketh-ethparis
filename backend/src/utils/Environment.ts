import { config } from 'dotenv';
config();

export class Environment {
  /**
   * @dev Application port which defaults to 8000
   */
  static PORT = process.env.PORT ? Number(process.env.PORT) : 8000;

  /**
   * @dev Database port which defaults to 3306 for mysql
   */
  static DB_PORT = Number(process.env.DB_PORT);

  /**
   * @dev Database host
   */
  static DB_HOST: string = process.env.DB_HOST;

  /**
   * @dev Database password
   */
  static DB_PASSWORD: string = process.env.DB_PASSWORD;

  /**
   * @dev Database user
   */
  static DB_USER: string = process.env.DB_USER;

  /**
   * @dev Database name
   */
  static DB_NAME: string = process.env.DB_NAME;

  /**
   * @dev Private key for mocking wallet
   */
  static PRIVATE_KEY: string =
    process.env.PRIVATE_KEY ??
    'dd6c0e88f09781a788b1454c12761a85a0706f76705d126c9fbeed59249d9e4b'; // Randomly created Private Key to supress errors on initial build;

  /**
   * @dev Given web3 provider
   */
  static NETWORK_RPC_URL: string = process.env.NETWORK_RPC_URL;

  /**
   * @dev Version of the current API
   * @example 1
   * @example 2
   */
  static API_VERSION = String(process.env.API_VERSION);

  /**
   * @dev Optional CORS url
   */
  static APP_CORS: string | null = process.env.APP_CORS;

  /**
   * @dev APP version, eg. development
   */
  static APP_VERSION: string = process.env.APP_VERSION;

  /**
   * @dev Alchemy Web3 Provider Url
   */
  static ALCHEMY_URL: string = process.env.ALCHEMY_URL;

  /**
   * @dev EAS Contract Adress
   */
  static EAS_CONTRACT: string = process.env.EAS_CONTRACT;

  /**
   * @dev EAS Schema Uid
   */
  static EAS_SCHEMA_UID: string = process.env.EAS_SCHEMA_UID;
}
