# Movie Search + Supabase Auth

Итоговый учебный проект без избранного.

## Запуск

1. Скопируй `.env.example` в `.env`.
2. Заполни TMDB token, Supabase URL и Supabase Publishable Key.
3. Выполни:

```bash
npm install
npm run dev
```

## Функциональность

- регистрация через Supabase Auth;
- вход по email/password;
- сохранение сессии после F5;
- отслеживание изменения auth-состояния;
- выход;
- поиск фильмов через TMDB;
- подробности фильма и трейлер.

Избранного и таблицы `favorites` в проекте нет.
