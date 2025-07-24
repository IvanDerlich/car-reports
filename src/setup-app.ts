import { INestApplication, ValidationPipe } from "@nestjs/common";
import cookieSession from "cookie-session";

export const setupApp = async (app: INestApplication) => {
  app.use(
    cookieSession({
      keys: ['asdfasdf'],
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
}