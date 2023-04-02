import type { NextApiRequest, NextApiResponse } from 'next'
import formidable, { type File } from 'formidable';
import { v4 as uuidv4 } from 'uuid';
import { env } from '~/env.mjs';
import * as ftp from "basic-ftp"
import { FileType, PrismaClient } from '@prisma/client'
import { resolveUploadResource } from '~/utils/functions';
import { getPlaiceholder } from 'plaiceholder';

export const config = {
    api: {
        bodyParser: false,
    }
};

type ProcessedFiles = Array<[string, File]>;
type FileFtpUrl = {
    originalName: string,
    newName: string,
    fileId: number
}

export interface FtpUploadResult {
    status: 200 | 500,
    message: string,
    urls: FileFtpUrl[]
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    let status = 200;
    let resultBody: FtpUploadResult = { status: 200, message: 'Files were uploaded successfully', urls: [] };

    /* Get files using formidable */
    const files = await new Promise<ProcessedFiles | undefined>((resolve, reject) => {
        const form = new formidable.IncomingForm();
        const files: ProcessedFiles = [];
        form.on('file', function (field, file) {
            files.push([field, file]);
        })
        form.on('end', () => resolve(files));
        form.on('error', err => reject(err));
        form.parse(req, () => {
            //
        });
    }).catch(() => {
        // console.error(e);
        status = 500;
        resultBody = {
            status: 500, message: 'Upload error', urls: []
        }
    });

    if (files?.length) {
        const client = new ftp.Client()

        try {
            await client.access({
                host: env.FTP_HOST,
                user: env.FTP_USER,
                password: env.FTP_PASS
            })

            const prisma = new PrismaClient()
            const urls: FileFtpUrl[] = []

            for (const uploadedFile of files) {
                const file = uploadedFile[1];

                if (!file.originalFilename) {
                    continue;
                }

                const split = file.originalFilename.split(".");
                const extension = split[split.length - 1];

                const random = uuidv4().replace(/-/g, "");
                const newFileName = `${random}.${extension ?? ""}`;

                await client.uploadFrom(file.filepath, `/${newFileName}`);

                const fileType = file.mimetype?.includes("image") ? FileType.Image :
                    file.mimetype?.includes("video") ? FileType.Video :
                        FileType.Unknown;

                let blurHash: string | undefined;

                if (fileType == FileType.Image) {
                    // calculate blurHash for uploaded images

                    const { base64 } = await getPlaiceholder(resolveUploadResource(newFileName));
                    blurHash = base64;
                }

                const fileOnDb = await prisma.file.create({
                    data: {
                        fileUrl: newFileName,
                        fileType,
                        mimeType: file.mimetype,
                        blurHash
                    }
                })

                urls.push({
                    originalName: file.originalFilename,
                    newName: newFileName,
                    fileId: fileOnDb.id
                });
            }

            resultBody = {
                ...resultBody,
                urls: urls
            }
        }
        catch (err) {
            // console.error(err);
            status = 500;
            resultBody = {
                status: 500, message: 'Upload error', urls: []
            }
        }

        client.close()
    }

    res.status(status).json(resultBody);
}

export default handler;