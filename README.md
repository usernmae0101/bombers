<p align="center">
    <img alt="License" src="https://img.shields.io/github/license/bombers0/bombers">
    <img alt="Status" src="https://img.shields.io/static/v1?label=status&message=development&color=blueviolet">
    <img alt="Lines of Code" src="https://img.shields.io/tokei/lines/github/bombers0/bombers">
	<a href="https://codecov.io/gh/bombers0/bombers">
    	<img alt="Coverage" src="https://codecov.io/gh/bombers0/bombers/branch/main/graph/badge.svg">
	</a>
	<a href="https://lgtm.com/projects/g/bombers0/bombers">
    	<img alt="Alerts" src="https://img.shields.io/lgtm/alerts/github/bombers0/bombers">
	</a>
	<a href="https://lgtm.com/projects/g/bombers0/bombers">
    	<img alt="Quality" src="https://img.shields.io/lgtm/grade/javascript/github/bombers0/bombers">
	</a>
	<img alt="GitHub contributors" src="https://img.shields.io/github/contributors/bombers0/bombers">
	<img alt="GitHub Workflow Status" src="https://img.shields.io/github/workflow/status/bombers0/bombers/CI">
	<img alt="GitHub stars" src="https://img.shields.io/github/stars/bombers0/bombers?style=social">
</p>

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

```
make build TARGET=[application|game-server]
```
