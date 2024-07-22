import { writeFile, mkdir, readdir } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import path from 'path';

async function getNewFileName(uploadDir: string): Promise<string> {
    const files = await readdir(uploadDir);
    const existingName = files.map(file => {
        const match = file.match(/^(\d+)\.webp$/);
        return match ? parseInt(match[1], 10) : null;
    }).filter(num => num !== null) as number[];

    const newName = existingName.length ? Math.max(...existingName) + 1 : 1;
    return `${newName}.webp`;
}

export async function POST(request: NextRequest) {
    try {
        const data = await request.formData();
        const userId = data.get('userId')?.toString() || '';
        const files = data.getAll('files') as File[];

        if (!files.length) {
            return NextResponse.json({ success: false, error: 'No files uploaded' });
        }

        // folder
        const uploadDir = path.join(process.cwd(), 'public', 'product', userId);

        // Create directory if it doesn't exist
        await mkdir(uploadDir, { recursive: true });

        for (const file of files) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const filePath = path.join(uploadDir, await getNewFileName(uploadDir));

            // Convert to WebP and save
            await sharp(buffer)
                .webp({ quality: 80 })
                .toFile(filePath);

            console.log(`Uploaded and converted file: ${filePath}`);
        }

        return NextResponse.json({ success: true, message: 'Files uploaded and converted to WebP successfully' });
    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json({ success: false, error: 'File upload failed' });
    }
}
