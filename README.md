# Автомийка — клієнтська частина

Клієнтська частина вебсервісу для запису на автомийку та детейлінг. Це фронтенд до мого API
(`carwash-booking-api`: FastAPI + PostgreSQL). Після лаби 4 (основа проєкту) у лабі 5 з'явилися
вхід і реєстрація, захищений кабінет, CRUD для послуг і автомобілів, валідація форм та робота з
даними сервера. Запис на послугу й екрани майстра та адміністратора будуть далі.

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
│   ├── common/      # Button, Input, Card, Badge, FormField, DataTable, CardGrid,
│   │                # DataList, Pagination, Breadcrumbs, ConfirmDialog, Skeleton, Loading
│   ├── layout/      # Header, Footer, Layout (публічні), DashboardLayout (кабінет із sidebar)
│   ├── ProtectedRoute.tsx
│   └── ErrorBoundary.tsx
├── pages/           # Home, About, Login, Register, Dashboard, Services*, Cars*, NotFound
├── services/        # api.ts (Axios + interceptors), services.service.ts, cars.service.ts
├── stores/          # authStore.ts (Zustand + persist)
├── schemas/         # схеми Zod: auth, service, car
├── types/           # типи відповідей API
├── utils/           # форматування, розбір помилок
├── hooks/           # useTheme, useDebounce
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

## Лабораторна 5: що реалізовано

**Рівень 1.** Сторінки входу й реєстрації, сесія в Zustand (`persist` сам тримає її в
localStorage), `ProtectedRoute` із поверненням на потрібну сторінку після входу, кабінет із
навігацією та виходом, індикатори завантаження, повідомлення про помилки.

**Рівень 2.** Списки, створення, редагування та видалення (з діалогом підтвердження) для послуг і
автомобілів. Валідація через React Hook Form + Zod, повторно використовувані `DataTable`,
`CardGrid`, `DataList`, пагінація.

**Рівень 3.** Дані сервера живуть у TanStack Query, у Zustand лише сесія. Toast-сповіщення, пошук із
debounce, сортування за заголовками колонок, сторінка перегляду послуги, хлібні крихти, скелетні
індикатори, адаптивний sidebar, що висувається на телефоні.

### Ролі

- **клієнт** — свої автомобілі (`/cars`), перегляд послуг;
- **адміністратор** — усе, що бачить клієнт, плюс створення, редагування й видалення послуг;
- **майстер** — перегляд послуг (його екрани з'являться пізніше).

Права на клієнті лише ховають зайве в інтерфейсі, а справжню перевірку виконує сервер.

### Очікування від API

| Метод і адреса                 | Призначення                                |
| ------------------------------ | ------------------------------------------ |
| `POST /auth/register`          | `full_name`, `email`, `phone?`, `password` |
| `POST /auth/login`             | `email`, `password` → `{ user, tokens }`   |
| `GET /services`                | `page`, `limit`, `search`, `sortBy`, `order` |
| `GET/PUT/DELETE /services/:id` | перегляд, зміна, видалення послуги         |
| `POST /services`               | створення послуги                          |
| `GET /cars`, `POST /cars`      | список і створення авто                    |
| `GET/PUT/DELETE /cars/:id`     | перегляд, зміна, видалення авто            |

Списки очікуються у форматі `{ data, pagination }`, помилки — у полі `detail`.

