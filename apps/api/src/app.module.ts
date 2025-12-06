import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SchemesModule } from './schemes/schemes.module';
import { ApplicationsModule } from './applications/applications.module';
import { InstallationsModule } from './installations/installations.module';
import { MediaModule } from './media/media.module';
import { NotificationsModule } from './notifications/notifications.module';
import { BlogModule } from './blog/blog.module';
import { AdminModule } from './admin/admin.module';
import { AgentsModule } from './agents/agents.module';
import { CalculatorModule } from './calculator/calculator.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env',
    }),
    DbModule,
    AuthModule,
    UsersModule,
    SchemesModule,
    ApplicationsModule,
    InstallationsModule,
    MediaModule,
    NotificationsModule,
    BlogModule,
    AdminModule,
    AgentsModule,
    CalculatorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
