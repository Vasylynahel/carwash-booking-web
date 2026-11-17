# Автомийка — клієнтська частина

Клієнтська частина вебсервісу для запису на автомийку та детейлінг. Це фронтенд до мого API
(`carwash-booking-api`: FastAPI + PostgreSQL). Після лаби 4 (основа проєкту) у лабі 5 з'явилися
вхід і реєстрація, захищений кабінет, CRUD для послуг і автомобілів, валідація форм та робота з
даними сервера. У лабі 6 додано сповіщення в реальному часі, розширені компоненти, оптимізацію, PWA та розгортання. Запис на послугу й екрани майстра та адміністратора будуть далі.

## Технології

- React 19 + TypeScript
- Vite
- Tailwind CSS 4 (тема через `@theme`, темна тема через `@custom-variant`)
- React Router 8
- Axios (interceptors)
- TanStack Query, Zustand, React Hook Form + Zod 4
- Socket.io-client, Headless UI, dnd-kit, Recharts, react-day-picker, react-easy-crop, Tiptap, Motion
- vite-plugin-pwa (Workbox), Vitest + Testing Library, GitHub Actions + Vercel
- ESLint + Prettier

## Встановлення та запуск

Потрібні Node.js 22.12+ (або 24 LTS) і npm. Серверна частина за замовчуванням очікується на
`localhost:8000`.

```bash
git clone [URL репозиторію]
cd carwash-booking-web
npm install
cp .env.example .env     # за потреби поправити адреси API та Socket.io
npm run dev              # режим розробки
npm run build            # збірка для продакшену
npm run lint             # перевірка ESLint
npm test                 # тести Vitest
npm run analyze          # карта складу пакета (stats.html)
npm run format           # форматування Prettier
```

## Змінні середовища

| Змінна          | Призначення                          | Приклад                     |
| --------------- | ------------------------------------ | --------------------------- |
| `VITE_API_URL`  | Адреса REST API (разом із `/api`)    | `http://localhost:8000/api` |
| `VITE_SOCKET_URL` | Адреса Socket.io (без `/api`)      | `http://localhost:8000`     |
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


## Лабораторна 6: що реалізовано

**Рівень 1.** Одне з'єднання Socket.io на весь кабінет (`useSocketConnection` у `DashboardLayout`,
токен передається в `auth.token`), підписки через `useSocketEvent`. Дзвіночок сповіщень із
лічильником непрочитаних, індикатор з'єднання та онлайн-статус користувачів. Списки послуг,
автомобілів і каталог оновлюються за подіями сервера через `invalidateQueries`. Модальні вікна
на Headless UI (`Modal`, `ConfirmDialog`), вкладки (`Tabs`), випадне меню з пошуком (`SearchSelect`,
вибір марки авто).

**Рівень 2.** Перетягування для зміни порядку (dnd-kit, працює й з клавіатури), стовпчикова
діаграма послуг (Recharts), нескінченне прокручування каталогу (`useInfiniteQuery` +
`IntersectionObserver`), завантаження фото з попереднім переглядом і обрізанням (react-easy-crop),
календар (react-day-picker), текстовий редактор нотаток (Tiptap), анімація переходів між
сторінками (Motion, поважає «зменшити рух»).

**Рівень 3.** Розбиття коду: сторінки, кабінет і важкі вкладки вантажаться через `lazy`;
рушій анімацій теж окремим chunk-ом. PWA (маніфест, service worker, офлайн-оболонка), кешування
запитів: TanStack Query на клієнті та Workbox `NetworkFirst` для переліку послуг. SEO: метатеги,
Open Graph, `robots.txt`, `sitemap.xml`, заголовок вкладки для кожної сторінки. Тести (Vitest),
CI/CD у GitHub Actions, розгортання на Vercel.

### Події Socket.io

| Подія              | Напрямок          | Дані                                    | Що робить клієнт                      |
| ------------------ | ----------------- | --------------------------------------- | ------------------------------------- |
| `notification`     | сервер → клієнт   | `{ type?, title?, message }`            | додає в дзвіночок і показує toast     |
| `presence:list`    | сервер → клієнт   | `number[]` (id користувачів онлайн)     | замінює список онлайн                 |
| `user:online`      | сервер → клієнт   | `number` (id)                           | додає користувача в онлайн            |
| `user:offline`     | сервер → клієнт   | `number` (id)                           | прибирає користувача з онлайн         |
| `services:changed` | сервер → клієнт   | без даних                               | перезавантажує списки послуг          |
| `cars:changed`     | сервер → клієнт   | без даних                               | перезавантажує список автомобілів     |

Підключення без дійсного JWT сервер відхиляє повідомленням `unauthorized`, після чого клієнт
завершує сесію.

### Кешування

Дані сервера кешує TanStack Query (`staleTime` 30 с). У service worker кешується лише
`GET /api/services*` (до 5 хвилин, спершу мережа). Особисті дані (автомобілі, профіль) свідомо
не кешуються, щоб не лишатися на пристрої після виходу з облікового запису.

### Розгортання

Клієнт розгортається на Vercel, правило перезапису всіх шляхів на `index.html` лежить у
`vercel.json`. Змінні `VITE_API_URL` і `VITE_SOCKET_URL` задаються в налаштуваннях проєкту
Vercel і підставляються під час збірки, тому після їх зміни потрібне повторне розгортання. Адресу
розгорнутого клієнта треба вписати в `FRONTEND_URL` на сервері (CORS і Socket.io).

CI/CD: `.github/workflows/deploy.yml` на кожен push і pull request запускає лінтинг, тести
та збірку; розгортання на Vercel виконується лише з гілки `main` після їх успіху. Потрібні секрети
репозиторію: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`.

Посилання: [адреса розгорнутого клієнта] · [адреса API].

### Продуктивність

Виміряні значення Lighthouse на розгорнутій версії (заповнити після розгортання):

- Performance / Accessibility / Best Practices / SEO: [значення]
- LCP: [значення], INP: [значення], CLS: [значення]

Розмір початкового завантаження після розбиття коду: основний пакет ≈ 128 КБ (gzip).
Recharts і Tiptap потрапляють лише у власні chunk-и вкладок кабінету.

### Тестування

`npm test` запускає тести Vitest: сповіщення (підписка й зняття обробника), діалог підтвердження
(у т. ч. Escape), вкладки, випадне меню з пошуком, список із перетягуванням, редактор нотаток,
захищені маршрути, функції форматування.
