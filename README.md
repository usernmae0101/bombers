<p align="center">
    <img alt="License" src="https://img.shields.io/github/license/bombers0/bombers">
    <img alt="Status" src="https://img.shields.io/static/v1?label=status&message=development&color=blueviolet">
    <img alt="Lines of Code" src="https://img.shields.io/tokei/lines/github/bombers0/bombers">
	<a href="https://codecov.io/gh/username0101010/bombers">
      <img src="https://codecov.io/gh/username0101010/bombers/branch/dev/graph/badge.svg?token=OV94I2TJ59"/>
    </a>
	<img alt="Code Size" src="https://img.shields.io/github/languages/code-size/bombers0/bombers">
	<a href="https://lgtm.com/projects/g/bombers0/bombers">
    	<img alt="Quality" src="https://img.shields.io/lgtm/grade/javascript/github/bombers0/bombers">
	</a>
</p>

# :boom: Бомберы: Перерождение

<img src="https://i.ibb.co/d26hL1Z/screen.jpg" align="right" width="40%" alt="boom">

В этом репозитории создаётся ремейк Бомберов. Если желаете принять участие в разработке, пожалуйста, [ознакомьтесь](.github/CONTRIBUTING.md).

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

```
make build TARGET=[application|game-server]
```
