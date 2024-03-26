import { Module } from '@nestjs/common';
import { MyConfigModule } from 'src/my-config/my-config.module';
import { SendmailService } from './email.service';

@Module({
    imports: 
    [
        MyConfigModule,
    ],
    controllers:[],
    providers:[SendmailService],
    exports: [SendmailService],
})
export class EmailModule {}




