import { Controller, Post, Body, UploadedFile, UseInterceptors, Get, Res, HttpException, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = path.join(__dirname, '..', 'uploads');
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          cb(null, `${Date.now()}-${file.originalname}`);
        },
      }),
    }),
  )
  uploadFile(
    @Body('dataset') dataset: string,
    @Body('label') label: string,
    @Body('description') description: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const filePath = this.appService.saveImage(dataset, label, file.path, description);
    return { message: 'File uploaded successfully', filePath };
  }

  @Get('folders')
  getFolders() {
    const folders = this.appService.getFolders();
    return { folders };
  }

  @Post('subfolders')
  getSubfolders(@Body('folderName') folderName: string) {
    const subfolders = this.appService.getSubfolders(folderName);
    return { subfolders };
  }

  @Post('images')
  getImages(@Body('folderName') folderName: string, @Body('subfolderName') subfolderName: string) {
    const images = this.appService.getImages(folderName, subfolderName);
    return { images };
  }

  @Post('readme')
  getReadme(@Body('folderName') folderName: string) {
    const readme = this.appService.getReadme(folderName);
    return { readme };
  }

  @Post('download')
  async downloadDataset(@Body('dataset') dataset: string, @Res() res: Response) {
    try {
      const buffer = await this.appService.compressDataset(dataset);
      res.set({
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename=${dataset}.zip`,
        'Content-Length': buffer.length,
      });
      res.send(buffer);
    } catch (error) {
      throw new HttpException('Dataset not found', HttpStatus.NOT_FOUND);
    }
  }
}
