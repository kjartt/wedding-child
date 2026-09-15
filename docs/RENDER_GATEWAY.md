# Доступ без VPN через Render

## Почему меняется адрес

Основной Worker и Google Sheets API исправны, но российские провайдеры могут ограничивать
соединения с Cloudflare. Поэтому браузер не должен обращаться к домену `workers.dev` напрямую.

Новая схема:

```text
Браузер → Render Static Site → /api/* rewrite → Cloudflare Worker → Google Sheets
```

Render отдаёт собранный frontend со своего домена `onrender.com` и на своей стороне пересылает
запросы `/api/*` в существующий Worker. Google credentials остаются только в Cloudflare.
Frontend продолжает обращаться к относительному `/api/values`, поэтому интервалы polling и код
обновления данных не меняются.

## Создать сайт

1. Отправьте `render.yaml` и текущий frontend-код в ветку `main` GitHub-репозитория
   `kjartt/wedding-child`.
2. В Render откройте **New → Blueprint**.
3. Подключите репозиторий `kjartt/wedding-child` и выберите ветку `main`.
4. Render прочитает `render.yaml` и предложит создать бесплатный Static Site
   `wedding-child-display`.
5. Подтвердите создание и дождитесь статуса **Live**.
6. Откройте выданный адрес вида `https://wedding-child-display.onrender.com`.

Переменные окружения и Google secrets в Render добавлять не нужно.

## Проверка

Проверьте без VPN, желательно с того же Wi-Fi:

1. `https://ВАШ-АДРЕС.onrender.com/api/healthz` возвращает `{"status":"ok"}`.
2. `https://ВАШ-АДРЕС.onrender.com/api/values` возвращает `a`, `b`, `fetchedAt` и
   `"stale":false`.
3. Корень сайта открывает диаграмму и шрифты/раскладка совпадают с текущей версией.
4. Изменение таблицы появляется на экране в прежнем режиме polling.
5. Прямая ссылка с темой, например `/?style=olive`, работает после обновления страницы.

Если `onrender.com` также недоступен у конкретного провайдера, следующий надёжный шаг —
подключить собственный домен к Render. Не направляйте его через Cloudflare Proxy: иначе трафик
снова попадёт под то же ограничение.

## Что осталось прежним

- Визуальные стили и три варианта оформления.
- Интервал запросов frontend и backoff.
- Cloudflare Worker, его кэш и secrets.
- Приватность Google-таблицы.
- Старый `workers.dev`-адрес как технический резерв.
