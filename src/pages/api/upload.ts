import type { NextApiRequest, NextApiResponse } from 'next'
import formidable, { type File } from 'formidable';
import Client from "ftp-ts";
import { v4 as uuidv4 } from 'uuid';
import { env } from '~/env.mjs';

export const config = {
    api: {
        bodyParser: false,
    }
};

type ProcessedFiles = Array<[string, File]>;
type FileFtpUrl = {
    originalName: string,
    newName: string,
}

export interface FtpUploadResult {
    status: 'ok' | 'fail',
    message: string,
    urls: FileFtpUrl[]
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    let status = 200;
    let resultBody: FtpUploadResult = { status: 'ok', message: 'Files were uploaded successfully', urls: [] };

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
    }).catch(e => {
        console.log(e);
        status = 500;
        resultBody = {
            status: 'fail', message: 'Upload error', urls: []
        }
    });

    if (files?.length) {
        const client = await Client.connect({
            host: env.FTP_HOST,
            port: 21,
            user: env.FTP_USER,
            password: env.FTP_PASS
        });

        const urls: FileFtpUrl[] = []
        for (const uploadedFile of files) {
            const file = uploadedFile[1];
            // console.log(file.originalFilename);

            if (!file.originalFilename) {
                continue;
            }

            const split = file.originalFilename.split(".");
            const extension = split[split.length - 1];

            const random = uuidv4().replace(/-/g, "");
            const newFileName = `${random}.${extension ?? ""}`;

            await client.put(file.filepath, `/${newFileName}`);

            urls.push({
                originalName: file.originalFilename,
                newName: newFileName
            });
        }

        resultBody = {
            ...resultBody,
            urls: urls
        }

        try {
            void client.end();
        } catch { }
    }

    res.status(status).json(resultBody);
}

export default handler;