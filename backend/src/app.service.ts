import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      status: 'ok',
      message: 'mdtsk backend is ready to build upon',
      timestamp: new Date().toISOString(),
    };
  }
}
