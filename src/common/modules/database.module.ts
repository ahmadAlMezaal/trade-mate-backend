import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Mongoose } from 'mongoose';
import { ConfigVariables } from 'src/types/enums';

@Module(
    {
        imports: [
            MongooseModule.forRootAsync(
                {
                    imports: [ConfigModule],
                    inject: [ConfigService],
                    useFactory: (configService: ConfigService) => {
                        const uri = configService.get<string>(ConfigVariables.MONGODB_URI);
                        const mongoose = new Mongoose();

                        mongoose.connection.on('connected', () => {
                            console.log('Connected to MongoDB!'.toUpperCase());
                        });

                        mongoose.connection.on('error', (err) => {
                            console.error('Error connecting to MongoDB:', err.message);
                        });

                        mongoose.connection.on('disconnected', () => {
                            console.log('Disconnected from MongoDB'.toLowerCase());
                        });

                        return { uri };
                    },
                }
            ),
        ],
        exports: [MongooseModule],
    }
)
export class DatabaseModule { }
