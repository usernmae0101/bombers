# Центальный сервер

<img src="https://i.ibb.co/vqNFdQM/connection-diagram.png" align="right" alt="connection">

```bash
.
└── src
    ├── controllers
    ├── middlewares
    ├── models
    ├── routes
    └── sockets
```

* Состояние приложения: чат, онлайн, список серверов;

* Коммуникация по WebSocket'у с клиентом;

* Коммуникация по WebSocket'у с игровым сервером;

* REST API (СУБД mongodb);

* HTTP сервер (будет проксироваться на nginx или apache).
