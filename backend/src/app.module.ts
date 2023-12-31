import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CONFIG } from 'src/config';
import { EasModule } from 'src/modules/eas/Eas.module';
import { EventModule } from 'src/modules/event/Event.module';
import { NFTModule } from 'src/modules/nft/NFT.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    /* REMOVE COMMENTS FOR DB CONNECTION */
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => {
        return CONFIG.MYSQL;
      },
    }),
    /* REMOVE COMMENTS FOR DB CONNECTION */

    EventModule,
    EasModule,
    NFTModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
