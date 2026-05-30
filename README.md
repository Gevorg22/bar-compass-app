# BarCompass 🧭

**[Открыть приложение](https://gevorg22.github.io/bar-compass-app/)**

Находит ближайшие бары, пабы, ночные клубы и алкомаркеты рядом с тобой и показывает направление в виде компаса. Работает через GPS браузера и бесплатное OpenStreetMap API, без регистрации и платных ключей.

## Что умеет

Три режима просмотра: **компас** с анимированной стрелкой, **радар** с точками всех мест поблизости и **карта** с маркерами. Фильтры по типу заведения, карточка с временем работы и кнопкой маршрута, поддержка API ориентации устройства для реального компаса на мобилках.

## Стек

**Next.js 16** (App Router, статический экспорт) · **TypeScript** strict · **Zustand** · **Framer Motion** · **MapLibre GL** · **Overpass API / OpenStreetMap** · **CSS Modules** · **ESLint 9** + **Prettier**

## Архитектура

Feature-Sliced Design (FSD):

```
src/
  shared/        # утилиты, store, UI-киты
  entities/      # place, user-location
  features/      # geolocation, device-compass, find-places, filter-places
  widgets/       # compass-view, radar-view, map-view, place-info
  app/           # layout, page, AppShell
```

## Запуск локально

```bash
npm install
npm run dev
```
