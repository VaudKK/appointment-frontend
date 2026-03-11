import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "./s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';


export default async function uploadFile(organizationId: string, file: File): Promise<string> {
    const buffer = Buffer.from(await file.arrayBuffer());

    const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: `uploads/${organizationId}/${Date.now()}/${file.name}`,
        Body: buffer,
        ContentType: file.type,
    });

    const response = await s3.send(command);

    if (response.$metadata.httpStatusCode !== 200) {
        throw new Error("Failed to upload file");
    }

    return command.input.Key!;
}


export async function downloadFile(key: string): Promise<string> {
    
    const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 60 });

    return url;

}
