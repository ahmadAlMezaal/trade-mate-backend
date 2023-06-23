import { Injectable } from '@nestjs/common';
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { ConfigService } from '@nestjs/config';
import { Stream } from 'stream';

@Injectable()
export class AwsService {

    private s3: S3Client;

    constructor(private readonly configService: ConfigService) {
        this.s3 = new S3Client({ region: this.configService.get('aws.region') });
    }

    private generateBuffer(stream: Stream) {
        const chunks: Buffer[] = [];
        return new Promise<Buffer>(
            (resolve, reject) => {
                stream.on('data', (chunk) => chunks.push(chunk));
                stream.on('end', () => resolve(Buffer.concat(chunks)));
                stream.on('error', (error) => reject(error));
            }
        );
    }

    public async uploadFile(createReadStream: any, fileName: string) {
        const stream = createReadStream();
        const buffer = await this.generateBuffer(stream);

        const timestamp = Date.now();
        const randomIdentifier = Math.floor(Math.random() * 1000);
        const finalFileName = `${timestamp}-${randomIdentifier}-${fileName}`;

        const params = {
            Bucket: this.configService.get('aws.bucketName'),
            Key: finalFileName,
            Body: buffer,
        };

        const command = new PutObjectCommand(params);
        return this.s3.send(command);
    }

}
