![License](https://img.shields.io/github/license/bombers0/bombers)
![Process](https://img.shields.io/static/v1?label=status&message=development&color=blueviolet)
![Lines of code](https://img.shields.io/tokei/lines/github/bombers0/bombers)
![Github Open Issues](https://img.shields.io/github/issues/bombers0/bombers)
![GitHub contributors](https://img.shields.io/github/contributors/bombers0/bombers)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/bombers0/bombers/CI)
![GitHub stars](https://img.shields.io/github/stars/bombers0/bombers?style=social)

# :boom: Бомберы: Перерождение

<img src="https://i.ibb.co/d26hL1Z/screen.jpg" align="right" width="40%" alt="boom">

В этом репозитории создаётся ремейк Бомберов. Если желаете принять участие в разработке, пожалуйста, [ознакомьтесь](CONTRIBUTING.md).

## :cd: Установка

```bash
git clone https://github.com/bombers0/bombers.git
cd bombers
make install
```

>Команда ```make install``` - необязательная, если установка производится на сервере.

## :rocket: Запуск

### В режиме разработки

```
make run-dev TARGET=[client|mongo|app-server|game-server]
```

>client, mongo, game-server и app-server запускать в отдельных терминалах.

![banner](docs/assets/run-dev.gif "Режим разработки")

### На сервере

с make:

```
make build TARGET=[application|game-server]
```

или без make:

```
docker-compose -f ./docker/[application|game-server].yml up -d --build
```
