# Автомийка — клієнтська частина

Клієнтська частина вебсервісу для запису на автомийку та детейлінг. Це фронтенд до мого API
(`carwash-booking-api`: FastAPI + PostgreSQL). У цій лабораторній я підготувала основу застосунку:
налаштований проєкт, розмітку, набір UI-компонентів і зв'язок із сервером. Сторінки входу, запису
та кабінети з'являться в наступних лабораторних.

## Технології

- React 19 + TypeScript
- Vite
- Tailwind CSS 4 (тема через `@theme`, темна тема через `@custom-variant`)
- React Router 8
- Axios (interceptors)
- ESLint + Prettier

## Встановлення та запуск

Потрібні Node.js 22.12+ (або 24 LTS) і npm. Серверна частина за замовчуванням очікується на
`localhost:8000`.

```bash
git clone [URL репозиторію]
cd carwash-booking-web
npm install
cp .env.example .env     # за потреби поправити адресу API
npm run dev              # режим розробки
npm run build            # збірка для продакшену
npm run lint             # перевірка ESLint
npm run format           # форматування Prettier
```

## Змінні середовища

| Змінна          | Призначення                          | Приклад                     |
| --------------- | ------------------------------------ | --------------------------- |
| `VITE_API_URL`  | Адреса REST API (разом із `/api`)    | `http://localhost:8000/api` |
| `VITE_APP_NAME` | Назва застосунку в шапці та футері   | `Автомийка`                 |

Для різних режимів є `.env.development` та `.env.production`. Змінні з префіксом `VITE_`
потрапляють у збірку, тому секрети в них не зберігаю.

## Структура проєкту

```
src/
├── components/
│   ├── common/      # Button, Input, Card, Badge, Loading
│   ├── layout/      # Header, Footer, Layout
│   └── ErrorBoundary.tsx
├── pages/           # HomePage, AboutPage, NotFoundPage
├── services/        # api.ts (Axios + interceptors)
├── types/           # типи відповідей API
├── utils/           # форматування дат, цін, тривалості, розбір помилок
├── hooks/           # useTheme
└── constants/       # назва застосунку, підписи статусів
```

Імпорти абсолютні: `@/components/common/Button` замість довгих `../../`.

## Що реалізовано

**Рівень 1:** проєкт на Vite + TypeScript, Tailwind CSS, ESLint і Prettier, React Router, Axios,
структура папок, адаптивний макет.

**Рівень 2:** компоненти Button, Input, Card, Badge, Loading; Header із меню (на телефоні
згортається в бургер), Footer із контактами, Layout, маршрути Home / About / NotFound, власні
кольори й шрифт у `@theme`.

**Рівень 3:** змінні середовища для різних режимів, типи відповідей API, interceptors Axios,
Error Boundary, псевдонім `@/`, функції форматування, темна тема з перемикачем.

## Скріншоти

[Додати: головна (світла й темна тема), головна на телефоні з відкритим меню, сторінка 404]

## Автор

[Ім'я, група]
