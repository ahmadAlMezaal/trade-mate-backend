import { Module } from '@nestjs/common';
import { SharedService } from './shared.service';
import { DatabaseModule } from 'src/common/modules/database.module';

@Module(
    {
        imports: [DatabaseModule],
        providers: [SharedService],
        exports: [SharedService],
    }
)

export class SharedModule { }
