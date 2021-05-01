# :boom: Бомберы: Перерождение
Мотивация - создать версию Бомберов с открытым исходным кодом, дальнейшую разработку и поддержку которой будет осуществлять сообщество. Без монетизации.

По мере закрытия актуальных задач, список будет пополняться.

## :pushpin: Задачи

- ### [v0.1.0](docs/v0.1.0/list.md)
- ### [v0.2.0](docs/v0.2.0/list.md)

## :cd: Установка

```bash
git clone https://github.com/bombers0/bombers.git
cd bombers
make install
```

>Команда ```make install``` - необязательная, если установка производится на сервере.

## :rocket: Запуск

### В режиме разработки

#### Зависимости

- make
- nodejs
- docker

```bash
make run-dev TARGET=[client|mongo|server]
```

>client, mongo и server запускать в отдельных терминалах.

![banner](docs/assets/run-dev.gif "Режим разработки")

### На сервере


#### Зависимости

- docker
- docker-compose

```bash
docker-compose up -d --build
```

## :hammer: Инструменты

- [nodejs](https://nodejs.org/) - платформа ввода-вывода, транслирущая javascript
- [docker](https://www.docker.com/) - упаковщик приложения для удобного развёртывания на сервере
- [typescript](https://www.typescriptlang.org/) - строгая типизация данных
- [jest](https://jestjs.io/) - тестирование приложения
- [webpack](https://webpack.js.org/) - сборщик приложения
- [react](https://reactjs.org/) - библиотека для разработки пользовательского интерфейса
- [pixijs](https://www.pixijs.com/) - обвёртка над 2d и WebGL контекстами для отрисовки графики
- [socketio](https://socket.io/) - WebSocket (TCP)
- [express](https://expressjs.com/ru/) - REST API
- [mongoose](https://mongoosejs.com/) - ORM к mongo (СУБД)
- [redux](https://redux.js.org/) - менеджер состояния приложения
- [saga](https://redux-saga.js.org/) - обработка асинхронных операций с состоянием приложения
