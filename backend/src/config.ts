import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { Event } from 'src/entities/Event.entity';

config();

export const CONFIG: Config = {
  MYSQL: {
    type: 'mysql',
    host: process.env.DB_HOST as string,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER as string,
    password: process.env.DB_PASSWORD as string,
    database: process.env.DB_NAME as string,
    entities: [Event],
    synchronize: true,
    autoLoadEntities: true,
  } as TypeOrmModuleOptions,
  PORT: Number(process.env.PORT),
  APP_CORS: process.env.APP_CORS,
  APP_NAME: 'Ticketh',
};

type Config = {
  MYSQL: TypeOrmModuleOptions;
  PORT: number;
  APP_CORS: string;
  APP_NAME: string;
};
