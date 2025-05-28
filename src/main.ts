import { NestFactory } from '@nestjs/core';
import { ValidationPipe, RequestMethod } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3001',
      'http://127.0.0.1:3000',
      'https://short-link-c6tfh4vai-bothiagos-projects.vercel.app',
      'https://short-link-c6tfh4vai-bothiagos-projects.vercel.app/',
      /^https:\/\/.*\.vercel\.app$/,
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Short Link API')
    .setDescription(
      `
      API para encurtamento de URLs com análise de dados e métricas avançadas.
      
      ## Funcionalidades principais:
      - ✂️ Encurtamento de URLs com códigos personalizados
      - 📊 Análise de dados e relatórios detalhados
      - 🔗 Redirecionamento rápido e confiável
      - 📈 Métricas e monitoramento
      - 🏥 Health checks para deployment
      
      ## Como usar:
      1. **Criar URL curta**: POST /url
      2. **Acessar URL**: GET /{shortCode}
      3. **Ver relatórios**: GET /reports/*
      4. **Monitoramento**: GET /metrics
    `,
    )
    .setVersion('1.0')
    .addTag('URLs', 'Operações para criação e gerenciamento de URLs encurtadas')
    .addTag('Redirect', 'Redirecionamento para URLs originais')
    .addTag('Reports', 'Relatórios e estatísticas de uso')
    .addTag('Health', 'Verificações de saúde da aplicação')
    .addTag('Metrics', 'Métricas para monitoramento (Prometheus)')
    .addServer('http://localhost:3000', 'Ambiente de desenvolvimento')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    customSiteTitle: 'Short Link API Documentation',
    customfavIcon: 'https://nestjs.com/img/logo_text.svg',
    customCss: `
      .swagger-ui .topbar { display: none; }
      .swagger-ui .info .title { color: #667eea; }
      .swagger-ui .info .description { line-height: 1.6; }
      .swagger-ui .tag-group .tag { 
        font-size: 18px; 
        margin: 10px 0; 
        color: #3b4151;
      }
      .swagger-ui .scheme-container { 
        background: #fafafa; 
        border-radius: 4px; 
        padding: 15px; 
        margin: 15px 0; 
      }
    `,
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      defaultModelsExpandDepth: 2,
      defaultModelExpandDepth: 2,
      tryItOutEnabled: true,
    },
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 API running on: http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api-docs`);
  console.log(`🌐 Frontend: http://localhost:3001`);
  console.log(`📊 Metrics: http://localhost:${port}/metrics`);
  console.log(`🏥 Health Check: http://localhost:${port}/health`);
}

bootstrap();
