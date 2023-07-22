import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { Attestation } from 'src/entities/Attestation.entity';
import { Event } from 'src/entities/Event.entity';
import { Environment } from 'src/utils/Environment';

config();

export const CONFIG: Config = {
  MYSQL: {
    type: 'mysql',
    host: Environment.DB_HOST,
    port: Environment.DB_PORT,
    username: Environment.DB_USER,
    password: Environment.DB_PASSWORD,
    database: Environment.DB_NAME,
    entities: [Event, Attestation],
    synchronize: true,
  } as TypeOrmModuleOptions,
  PORT: Environment.PORT,
  APP_CORS: Environment.APP_CORS,
  APP_NAME: 'Ticketh',
  AUTH_MESSAGE: 'Authorize Ticketh',
};

type Config = {
  MYSQL: TypeOrmModuleOptions;
  PORT: number;
  APP_CORS: string;
  APP_NAME: string;
  AUTH_MESSAGE: string;
};
