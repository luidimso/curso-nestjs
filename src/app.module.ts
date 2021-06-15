import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';
import { AppItalianService } from './app.italian.service';
import { AppDummy } from './app.dummy';
import { ConfigModule } from '@nestjs/config';
import ormConfig from './../config/orm.config';
import ormConfigProd from './../config/orm.config.prod';
import { SchoolModule } from './school/school.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ormConfig],
      expandVariables: true,
      envFilePath: `${process.env.NODE_ENV}.env`
    }),
    TypeOrmModule.forRootAsync({
      useFactory: process.env.NODE_ENV !== 'production' ? ormConfig : ormConfigProd
    }),
    EventsModule,
    SchoolModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [
    {
      provide: AppService,
      useClass: AppItalianService
    },
    {
      provide: 'APP_NAME',
      useValue: 'Nest Events Backend!'
    },{
      provide: 'MESSAGE',
      inject: [AppDummy],
      useFactory: (app) => app.dummy()+" Factory!"
    },
    AppDummy
  ],
})
export class AppModule {}
