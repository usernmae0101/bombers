# Клиент

## Структура

```bash
├── assets
│   ├── images
│   │   ├── bomb.png
│   │   ├── exit.png
│   │   ├── explosion.json
│   │   ├── explosion.png
│   │   ├── grass.png
│   │   ├── ping.png
│   │   ├── radius.png
│   │   ├── rating.png
│   │   ├── speed.png
│   │   └── tilemap_72x72.png
│   └── index.html
├── cfg
│   ├── webpack-common.config.js
│   ├── webpack-development.config.js
│   └── webpack-production.config.js
├── Dockerfile
├── node_modules
├── package.json
├── README.md
├── src
│   ├── api
│   │   ├── index.ts
│   │   ├── rating-api.ts
│   │   └── users-api.ts
│   ├── declarations.d.ts
│   ├── game
│   │   ├── containers
│   │   │   ├── BombsContainer.ts
│   │   │   ├── BoxesContainer.ts
│   │   │   ├── CratersContainer.ts
│   │   │   ├── FiresContainer.ts
│   │   │   ├── index.ts
│   │   │   ├── ItemsContainer.ts
│   │   │   ├── PlayersContainer.ts
│   │   │   └── RocksContainer.ts
│   │   ├── core
│   │   │   ├── BaseContainer.ts
│   │   │   ├── BaseEntity.ts
│   │   │   ├── EntityFactory.ts
│   │   │   ├── frames.ts
│   │   │   ├── Keyboard.ts
│   │   │   └── Renderer.ts
│   │   ├── entities
│   │   │   ├── ArrowEntity.ts
│   │   │   ├── BombEntity.ts
│   │   │   ├── BoxEntity.ts
│   │   │   ├── CraterEntity.ts
│   │   │   ├── EmotionEntity.ts
│   │   │   ├── FireEntity.ts
│   │   │   ├── index.ts
│   │   │   ├── ItemEntity.ts
│   │   │   ├── PlayerEntity.ts
│   │   │   └── RockEntity.ts
│   │   └── Game.ts
│   ├── handlers
│   │   ├── socket-app-handler.ts
│   │   ├── socket-game-battle-handler.ts
│   │   └── socket-game-lobby-handler.ts
│   └── ui
│       ├── App.tsx
│       ├── components
│       │   ├── Battle
│       │   │   ├── battle.module.scss
│       │   │   ├── GameContainer
│       │   │   │   ├── game-container.module.scss
│       │   │   │   └── index.tsx
│       │   │   ├── GameHUD
│       │   │   │   ├── game-hud.module.scss
│       │   │   │   └── index.tsx
│       │   │   ├── GameTimer
│       │   │   │   ├── game-timer.module.scss
│       │   │   │   └── index.tsx
│       │   │   ├── index.tsx
│       │   │   ├── Result
│       │   │   │   ├── index.tsx
│       │   │   │   └── result.module.scss
│       │   │   ├── RoomBar
│       │   │   │   ├── index.tsx
│       │   │   │   └── room-bar.module.scss
│       │   │   └── RoomSlots
│       │   │       ├── index.tsx
│       │   │       └── room-slots.module.scss
│       │   ├── Chat
│       │   │   ├── chat.module.scss
│       │   │   ├── index.tsx
│       │   │   ├── Member
│       │   │   │   ├── index.tsx
│       │   │   │   └── member.module.scss
│       │   │   ├── Message
│       │   │   │   ├── index.tsx
│       │   │   │   └── message.module.scss
│       │   │   └── SendForm
│       │   │       ├── form.module.scss
│       │   │       └── index.tsx
│       │   ├── Dashboard
│       │   │   ├── dashboard.module.scss
│       │   │   └── index.tsx
│       │   ├── Loader
│       │   │   ├── index.tsx
│       │   │   └── loader.module.scss
│       │   ├── Lobby
│       │   │   ├── index.tsx
│       │   │   ├── lobby.module.scss
│       │   │   └── Server
│       │   │       ├── index.tsx
│       │   │       └── server.module.scss
│       │   ├── Navbar
│       │   │   ├── index.tsx
│       │   │   └── navbar.module.scss
│       │   └── Rating
│       │       ├── RatingBanner
│       │       │   ├── index.tsx
│       │       │   └── rating-banner.module.scss
│       │       └── RatingList
│       │           ├── index.tsx
│       │           └── rating-list.module.scss
│       ├── index.scss
│       ├── index.tsx
│       ├── pages
│       │   ├── IndexPage
│       │   │   ├── index-page.module.scss
│       │   │   └── index.tsx
│       │   ├── ProfilePgae
│       │   │   ├── index.tsx
│       │   │   └── profile-page.module.scss
│       │   ├── RatingPage
│       │   │   ├── index.tsx
│       │   │   └── rating-page.module.scss
│       │   └── RoomPage
│       │       ├── index.tsx
│       │       └── room-page.module.scss
│       ├── redux
│       │   ├── actions
│       │   │   ├── chat-actions.ts
│       │   │   ├── dashboard-actions.ts
│       │   │   ├── game-actions.ts
│       │   │   ├── lobby-actions.ts
│       │   │   ├── rating-actions.ts
│       │   │   └── user-actions.ts
│       │   ├── reducers
│       │   │   ├── chat-reducer.ts
│       │   │   ├── dashboard-reducer.ts
│       │   │   ├── game-reducer.ts
│       │   │   ├── lobby-reducer.ts
│       │   │   ├── rating-reducer.ts
│       │   │   └── user-reducer.ts
│       │   ├── sagas
│       │   │   ├── root-saga.ts
│       │   │   ├── watchRatingFetchUsers.ts
│       │   │   ├── watchUserCreate.ts
│       │   │   └── watchUserFetchData.ts
│       │   ├── selectors
│       │   │   ├── chat-selectors.ts
│       │   │   ├── dashboard-selctors.ts
│       │   │   ├── game-selectors.ts
│       │   │   ├── lobby-selectors.ts
│       │   │   ├── rating-selectors.ts
│       │   │   └── user-selecrots.ts
│       │   ├── store.ts
│       │   └── types
│       │       ├── chat-types.ts
│       │       ├── dashboard-types.ts
│       │       ├── game-types.ts
│       │       ├── lobby-types.ts
│       │       ├── rating-types.ts
│       │       └── user-types.ts
│       ├── Routes.tsx
│       └── scss
│           ├── reset.scss
│           └── vars.scss
├── TODO
└── tsconfig.json
```
