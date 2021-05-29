# Общий модуль

# Структура

```bash
.
└── src
    ├── core
    └── utils
```

## Уточнения по коду

### Выравнивание при смене направления
<img src="https://i.ibb.co/KLJXp6K/turn-alignment.gif" align="left" width="30%" alt="align">

```typescript 

if ([UP, DOWN].includes(direction))
  alignPlayer(player, "x");

if ([LEFT, RIGHT].includes(direction))
  alignPlayer(player, "y");
```

Если направление движения поменялось, выравнивает игрока по оси обратной его движению:
если движется по Y - выравнивает по X, а если движется по X - выравнивает по Y. 
Выглядит не очень, но именно так и было в оригинальной версии.
