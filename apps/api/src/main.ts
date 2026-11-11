import { NestFactory } from '@nestjs/core';
import { getEnvironment, logger } from '@repo/lib';

import { AppModule } from './app.module';
import { ApiExceptionFilter } from './common/api-exception.filter';
import { NestLoggerAdapter } from './common/nest-logger.adapter';

async function bootstrap(): Promise<void> {
  const environment = getEnvironment();

  const app = await NestFactory.create(AppModule, {
    logger: new NestLoggerAdapter(logger),
  });

  app.useGlobalFilters(new ApiExceptionFilter());
  app.enableShutdownHooks();

  await app.listen(environment.PORT);
  logger.info(`API is listening on http://localhost:${environment.PORT}`);
}

bootstrap().catch((error: unknown) => {
  logger.error('API failed to start', error);
  process.exit(1);
});
