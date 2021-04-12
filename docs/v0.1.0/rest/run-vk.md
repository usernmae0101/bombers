# Запуск через приложение Вконтакте

## Данные
  - VK Bridge
      - [Документация](https://vk.com/dev/vkbridge)
      - [npm (original)](https://www.npmjs.com/package/@vkontakte/vk-bridge)

## Аутентификация

```typescript
auth_key = md5(api_id + '_' + viewer_id + '_' + api_secret)
```