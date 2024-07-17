import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as archiver from 'archiver';

@Injectable()
export class AppService {
  createDirectoryIfNotExists(directory: string): void {
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
  }

  saveImage(dataset: string, label: string, filePath: string, description?: string): string {
    const datasetPath = path.join(__dirname, '..', 'datasets', dataset);
    const datasetExists = fs.existsSync(datasetPath);
    
    this.createDirectoryIfNotExists(datasetPath);

    if (!datasetExists && description) {
      const readmePath = path.join(datasetPath, 'readme.txt');
      fs.writeFileSync(readmePath, description, { flag: 'w' });
    }

    const labelPath = path.join(datasetPath, label);
    this.createDirectoryIfNotExists(labelPath);

    const newFilePath = path.join(labelPath, path.basename(filePath));
    fs.renameSync(filePath, newFilePath); // Move file to new location

    return newFilePath;
  }

  getFolders(): string[] {
    const datasetsPath = path.join(__dirname, '..', 'datasets');
    return fs.readdirSync(datasetsPath).filter(file => fs.statSync(path.join(datasetsPath, file)).isDirectory());
  }

  getSubfolders(folderName: string): string[] {
    const folderPath = path.join(__dirname, '..', 'datasets', folderName);
    return fs.readdirSync(folderPath).filter(file => fs.statSync(path.join(folderPath, file)).isDirectory());
  }

  getImages(folderName: string, subfolderName: string): string[] {
    const subfolderPath = path.join(__dirname, '..', 'datasets', folderName, subfolderName);
    return fs.readdirSync(subfolderPath).filter(file => fs.statSync(path.join(subfolderPath, file)).isFile());
  }

  getReadme(folderName: string): string {
    const readmePath = path.join(__dirname, '..', 'datasets', folderName, 'readme.txt');
    if (fs.existsSync(readmePath)) {
      return fs.readFileSync(readmePath, 'utf-8');
    }
    return 'No description available.';
  }

  async compressDataset(dataset: string): Promise<Buffer> {
    const datasetPath = path.join(__dirname, '..', 'datasets', dataset);
    if (!fs.existsSync(datasetPath)) {
      throw new Error('Dataset not found');
    }

    const archive = archiver('zip', {
      zlib: { level: 9 }
    });

    const buffer: Buffer = await new Promise((resolve, reject) => {
      const buffers: Uint8Array[] = [];

      archive.on('data', data => buffers.push(data));
      archive.on('end', () => resolve(Buffer.concat(buffers)));
      archive.on('error', err => reject(err));

      archive.directory(datasetPath, false);
      archive.finalize();
    });

    return buffer;
  }
}
