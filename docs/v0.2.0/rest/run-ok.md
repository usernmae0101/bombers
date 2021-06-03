# Запуск через приложение Одноклассники

## Данные
  - JS SDK
      - [Документация](https://apiok.ru/dev/sdk/js/)
      - [npm (custom)](https://www.npmjs.com/package/ok-js-sdk/v/1.0.2)

## Аутентификация

```typescript
auth_sig = md5(logged_user_id + session_key +  application_secret_key)
```