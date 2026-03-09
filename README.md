# IXC Chat

Aplicação de chat em tempo real com **React**, **TypeScript**, **Express** e **Socket.IO**, usando **MongoDB** como banco de dados.

## Stack

| Camada   | Tecnologias                                                          |
| -------- | -------------------------------------------------------------------- |
| Frontend | React 19, TanStack Router, TanStack Query, Tailwind CSS 4, Socket.IO |
| Backend  | Express, Passport (session auth), Socket.IO, Mongoose                |
| Banco    | MongoDB 7                                                            |
| Infra    | Docker, Docker Compose                                               |

## Pré-requisitos

- [Node.js](https://nodejs.org/) 20.19+ ou 22.12+
- [pnpm](https://pnpm.io/) 9+
- [Docker](https://www.docker.com/) e Docker Compose (para execução via container)

## Execução com Docker (recomendado)

O `docker-compose.yml` sobe o backend e o MongoDB automaticamente.

```bash
docker compose up --build
```

Isso irá:

1. Criar um container **MongoDB 7** com volume persistente
2. Buildar e iniciar o **backend** na porta `3000`

O backend estará disponível em `http://localhost:3000`.

Para o frontend em desenvolvimento, rode separadamente:

```bash
cd frontend
pnpm install
pnpm dev
```

O frontend estará disponível em `http://localhost:5173` e se conecta ao backend em `http://localhost:3000`.

Para parar os containers:

```bash
docker compose down
```

Para remover também os dados do MongoDB:

```bash
docker compose down -v
```

## Execução local (sem Docker)

### 1. MongoDB

Tenha uma instância de MongoDB rodando localmente na porta padrão `27017`. Ou ajuste a variável `MONGODB_URI`.

### 2. Backend

```bash
cd backend
pnpm install
```

Crie um arquivo `.env` na raiz do backend (ou edite o existente):

```env
MONGODB_URI=mongodb://localhost:27017/chat
```

Inicie em modo de desenvolvimento:

```bash
pnpm dev
```

O servidor inicia em `http://localhost:3000`.

### 3. Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

O app abre em `http://localhost:5173`.

## Variáveis de ambiente

### Backend

| Variável         | Descrição                             | Padrão                            |
| ---------------- | ------------------------------------- | --------------------------------- |
| `PORT`           | Porta do servidor                     | `3000`                            |
| `MONGODB_URI`    | URI de conexão com o MongoDB          | `mongodb://localhost:27017/chat`  |
| `CORS_ORIGIN`    | Origem permitida pelo CORS            | `http://localhost:5173`           |
| `SESSION_SECRET` | Segredo para assinatura da sessão     | `dev-secret-change-in-production` |
| `NODE_ENV`       | Ambiente (`development`/`production`) | —                                 |

### Frontend

| Variável       | Descrição                  | Padrão                  |
| -------------- | -------------------------- | ----------------------- |
| `VITE_API_URL` | URL base da API do backend | `http://localhost:3000` |

## Scripts disponíveis

### Backend

| Comando      | Descrição                           |
| ------------ | ----------------------------------- |
| `pnpm dev`   | Inicia com hot-reload (`tsx watch`) |
| `pnpm build` | Compila TypeScript para `dist/`     |
| `pnpm start` | Executa o build de produção         |

### Frontend

| Comando        | Descrição                        |
| -------------- | -------------------------------- |
| `pnpm dev`     | Servidor de desenvolvimento Vite |
| `pnpm build`   | Build de produção                |
| `pnpm preview` | Preview do build de produção     |
| `pnpm lint`    | Linting via Biome                |
| `pnpm test`    | Testes via Vitest                |
