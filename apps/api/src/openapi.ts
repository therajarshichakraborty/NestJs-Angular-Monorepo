import type { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export const OPENAPI_DOCS_PATH = "docs";

export function setupOpenApi(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle("API")
    .setDescription("REST API for the NestJS Angular monorepo")
    .setVersion("1.0.0")
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(OPENAPI_DOCS_PATH, app, documentFactory, {
    jsonDocumentUrl: `${OPENAPI_DOCS_PATH}/json`,
    yamlDocumentUrl: `${OPENAPI_DOCS_PATH}/yaml`,
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}
