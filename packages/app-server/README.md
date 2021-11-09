# Центальный сервер

## Коммуникация

<p align="center">
  <img src="https://raw.githubusercontent.com/username0101010/bombers/dev/docs/assets/connection-diagram.png" width="100%" alt="connection" />
</p>

## Структура

```bash
.
├── Dockerfile
├── package.json
├── README.md
├── src
│   ├── api
│   │   ├── controllers
│   │   │   ├── index.ts
│   │   │   ├── profile-controller.ts
│   │   │   ├── rating-controller.ts
│   │   │   └── user-controller.ts
│   │   ├── middlewares
│   │   │   ├── index.ts
│   │   │   ├── native-auth-middleware.ts
│   │   │   ├── ok-auth-middleware.ts
│   │   │   └── vk-auth-middleware.ts
│   │   ├── models
│   │   │   ├── index.ts
│   │   │   ├── match-model.ts
│   │   │   └── user-model.ts
│   │   └── routers
│   │       ├── index.ts
│   │       ├── native-router.ts
│   │       ├── profile-router.ts
│   │       ├── rating-router.ts
│   │       └── social-router.ts
│   ├── app-state.ts
│   ├── app.ts
│   └── sockets
│       ├── ClientSocketHandler.ts
│       ├── GameSeverSocketHandler.ts
│       └── SocketManager.ts
├── TODO
└── tsconfig.json
```

