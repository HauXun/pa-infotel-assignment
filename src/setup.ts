import { INestApplication } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

export function setup(app: INestApplication): INestApplication {
  app.use(cookieParser());

  return app;
}
