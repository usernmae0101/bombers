![License](https://img.shields.io/github/license/bombers0/bombers)
![Process](https://img.shields.io/static/v1?label=process&message=development&color=blueviolet)
![Lines of code](https://img.shields.io/tokei/lines/github/bombers0/bombers)
![Github Open Issues](https://img.shields.io/github/issues/bombers0/bombers)
![Github Repository Size](https://img.shields.io/github/repo-size/bombers0/bombers)
![GitHub contributors](https://img.shields.io/github/contributors/bombers0/bombers)
![GitHub stars](https://img.shields.io/github/stars/bombers0/bombers?style=social)

# :boom: Бомберы: Перерождение

![boom](https://i.ibb.co/d26hL1Z/screen.jpg)

Если желаете принять участие в разработке, пожалуйста, [ознакомьтесь](CONTRIBUTING.md).

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
make run-dev TARGET=[client|mongo|app-server|game-server]
```

>client, mongo, game-server и app-server запускать в отдельных терминалах.

![banner](docs/assets/run-dev.gif "Режим разработки")

### На сервере


#### Зависимости

- ?make
- docker
- docker-compose

с make:

```bash
make build TARGET=[application|game-server]
```

или без make:

```bash
docker-compose -f [application|game-server].yml up -d --build
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
