import { Controller, Get } from '@nestjs/common';

@Controller('cms')
export class CmsController {
  @Get()
  getInfo(): string {
    return 'CMS page placeholder';
  }
}
