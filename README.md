# Short Link API

Backend API para serviço de encurtamento de URLs construído com NestJS.

## 🚀 Funcionalidades

- ✅ Encurtamento de URLs
- ✅ URLs customizadas
- ✅ Analytics e métricas
- ✅ Cache com Redis
- ✅ Rate limiting
- ✅ Documentação Swagger
- ✅ Autenticação
- ✅ Expiração de URLs
- ✅ QR Codes
- ✅ Monitoramento

## 🛠️ Tecnologias

- **NestJS** - Framework Node.js
- **TypeScript** - Linguagem de programação
- **Drizzle ORM** - ORM para banco de dados
- **MySQL** - Banco de dados
- **Redis** - Cache e sessões
- **Swagger** - Documentação da API
- **Docker** - Containerização

## 📦 Instalação

```bash
#Clone os projetos
git clone --recurse-submodules --remote-submodules git@github.com:BOThiago/short-link-api.git
```

```bash
# Instalar dependências
npm install

# Configurar banco de dados
npm run db:migrate

# Iniciar em desenvolvimento
npm run start:dev

# Iniciar em produção
npm run start:prod
```

## 🔧 Configuração

Crie um arquivo `.env` com as seguintes variáveis:

```env
# Database
DATABASE_URL=mysql://user:password@localhost:3306/shortlink
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USERNAME=root
DATABASE_PASSWORD=password
DATABASE_NAME=shortlink

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Application
PORT=3000
NODE_ENV=development
JWT_SECRET=your-jwt-secret

# Frontend
FRONTEND_URL=http://localhost:3001
```

## 📚 API Documentation

A documentação da API está disponível em `/api/docs` quando o servidor estiver rodando.

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes e2e
npm run test:e2e

# Coverage
npm run test:cov
```

## 🐳 Docker

```bash
# Build da imagem
docker build -t short-link-api .

# Executar com docker-compose
docker-compose up -d
```

## 📁 Estrutura do Projeto

```
src/
├── modules/          # Módulos da aplicação
├── shared/           # Código compartilhado
├── app.module.ts     # Módulo principal
└── main.ts          # Ponto de entrada
```

## 🤝 Frontend

O frontend está disponível como submódulo em: [short-link-ui](https://github.com/BOThiago/short-link-ui)

## 📄 Licença

Este projeto está sob a licença MIT.
