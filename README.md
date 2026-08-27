
# 🚗 AutoRIA Clone: High-Performance Automotive Marketplace

A scalable, containerized platform for selling vehicles. The project is designed with high loads, easy adaptability, and cloud deployment readiness (**AWS Ready**) in mind.

The system's architecture lays a solid foundation for future scaling, such as the integration of full-fledged car dealerships (B2B) with internal employee hierarchies.

---

## 🛠 Tech Stack
* **Frontend:** Next.js (React), Tailwind CSS, TypeScript
* **Backend:** NestJS, TypeScript, Mongoose
* **Database:** MongoDB (Atlas Cloud)
* **DevOps / Infrastructure:** Docker, Docker Compose
* **API Documentation:** Swagger / OpenAPI

---

## 🌟 Key Business Features

### 1. Flexible Role-Based Access Control (RBAC)
The system is built using Guards with an eye toward B2B scaling. Currently, 4 key roles are implemented:
* **Buyer:** A basic user who browses the catalog and searches for vehicles.
* **Seller:** A user who creates vehicle listings.
* **Manager:** A platform moderator. Checks suspicious listings, and can unblock or permanently delete them. Bypasses listing creation limits.
* **Admin:** A superuser (business owner and partners). Has full access, appoints managers, and can edit or delete any listing.

### 2. Account Types & Monetization
* **Basic:** Provided by default. Allows the placement of only **1 active listing**. Statistics are hidden.
* **Premium:** Removes limits on the number of vehicles. Grants access to advanced analytics (views, average prices). Features a "Premium Request" flow where users leave their phone number for a manager to contact them.

### 3. Smart Listing Creation
* **Dynamic Catalog:** Brand and model selection. If a required brand is missing, users can send a request to the administration to add it.
* **Multi-currency:** The seller sets the price in one currency (USD, EUR, or UAH). The platform automatically calculates and stores all three equivalents based on the current PrivatBank exchange rate.

### 4. Automated Moderation (Anti-Profanity Filter)
* Every listing is automatically checked for profanity.
* If violations are found, the listing is moved to the `rejected` status.
* The seller has **3 attempts** to edit the listing.
* After the 3rd failed attempt, the listing is blocked (`pending_manager`), and a moderator receives a notification for manual review.

### 5. Advanced Analytics (Premium/Admin Only)
Users with the appropriate access level can see the following data under their listings:
* View count: total, daily, weekly, and monthly.
* **Average market price** for a similar vehicle in the listing's specific city/region.
* **Average market price** for a similar vehicle across Ukraine.

### 6. Favorites
* Users can save vehicles they are interested in using a dedicated "Favorite" button on the listing cards.
* A separate menu is implemented for quick access, convenient browsing, and management of saved vehicles.

---

## 🚀 Run Instructions (Docker)

The project is fully containerized and does not require local Node.js installation. The database is hosted in the cloud (MongoDB Atlas).

### Prerequisites:
* Installed [Docker](https://www.docker.com/) and Docker Compose.

### Steps to Run:
1. Clone the repository and navigate to the project folder:
   ```bash
   git clone <repository_url>
   cd autoria-clone

```

2. Start the containers using the following command:
```bash
docker-compose up -d --build

```


3. The platform will be available at:
* **Frontend:** http://localhost:3001
* **Backend API:** http://localhost:3000
* **Swagger UI:** http://localhost:3000/api/docs



---

## 🔑 Test Credentials

For convenient testing of the platform's functionality, the database already contains pre-created users. Use these credentials to log in:

| Role | Name | Email (Login) | Password |
| --- | --- | --- | --- |
| **Admin** | admin | `admin@gmail.com` | `admin@gmail.com` |
| **Manager** | manager | `manager@gmail.com` | `manager@gmail.com` |
| **Seller (Premium)** | saller1 | `saller1@gmail.com` | `saller1@gmail.com` |
| **Seller (Basic)** | sanya | `sanya@gmail.com` | `sanya@gmail.com` |

```

collection POSMAN in the main folder autoria-clon under name Auto.ria Clone API.postman_collection

```

УКРАЇНСЬКОЮ МОВОЮ :
# 🚗 AutoRIA Clone: High-Performance Automotive Marketplace

Масштабована, контейнеризована платформа для продажу автомобілів. Проєкт розроблено з урахуванням високих навантажень, легкої адаптивності та готовності до розгортання в хмарному середовищі (**AWS Ready**).

Архітектура системи закладає міцний фундамент для майбутнього масштабування (наприклад, інтеграції повноцінних автосалонів з внутрішніми ієрархіями працівників).

---

## 🛠 Технологічний стек
* **Frontend:** Next.js (React), Tailwind CSS, TypeScript
* **Backend:** NestJS, TypeScript, Mongoose
* **Database:** MongoDB (Atlas Cloud)
* **DevOps / Infrastructure:** Docker, Docker Compose
* **API Documentation:** Swagger / OpenAPI

---

## 🌟 Ключові можливості (Business Features)

### 1. Гнучка система ролей та доступів (RBAC)
Система побудована на базі Guard-ів з прицілом на масштабування до рівня B2B (автосалони). Наразі реалізовано 4 ключові ролі:
* **Покупець (Buyer):** Базовий користувач, який переглядає каталог та шукає авто.
* **Продавець (Seller):** Користувач, що створює оголошення.
* **Менеджер (Manager):** Модератор платформи. Перевіряє підозрілі оголошення, може їх розблокувати або остаточно видалити. Оминає ліміти на створення оголошень.
* **Адміністратор (Admin):** Суперюзер (замовник та партнери). Має повний доступ, призначає менеджерів, редагує або видаляє будь-які оголошення.

### 2. Типи акаунтів та Монетизація
* **Базовий (Basic):** Надається за замовчуванням. Дозволяє розмістити лише **1 активне оголошення**. Статистика прихована.
* **Преміум (Premium):** Знімає ліміти на кількість авто. Надає доступ до розширеної аналітики (перегляди, середні ціни). Реалізовано флоу "запиту на Преміум", де користувач залишає свій телефон для зв'язку з менеджером.

### 3. Розумне створення оголошень
* **Динамічний каталог:** Вибір марок та моделей. Якщо потрібної марки немає, реалізовано флоу відправки запиту адміністрації на її додавання.
* **Мультивалютність:** Продавець вказує ціну в одній з валют (USD, EUR, UAH). Платформа автоматично конвертує та зберігає всі три еквіваленти за актуальним курсом ПриватБанку.

### 4. Автоматизована модерація (Anti-Profanity Filter)
* Кожне оголошення автоматично перевіряється на наявність нецензурної лексики.
* У разі виявлення порушень оголошення переводиться у статус `rejected`.
* Продавець має **3 спроби** на редагування.
* Після 3-ї невдалої спроби оголошення блокується (`pending_manager`), а модератор отримує сповіщення про необхідність ручної перевірки.

### 5. Розширена аналітика (Тільки для Premium/Admin)
Користувачі з відповідним рівнем доступу бачать під своїм оголошенням:
* Кількість переглядів: загалом, за день, за тиждень, за місяць.
* **Середня ринкова ціна** на аналогічне авто в місті продажу.
* **Середня ринкова ціна** на аналогічне авто по всій Україні.

### 6. Обране (Favorites)
* Користувачі мають змогу зберігати цікаві їм автомобілі за допомогою спеціальної кнопки "Обране" на картках оголошень.
* Реалізовано окреме меню для швидкого доступу, зручного перегляду та управління списком збережених автомобілів.

---

## 🚀 Інструкція із запуску (Docker)

Проєкт повністю контейнеризований і не потребує локального встановлення Node.js. База даних розгорнута в хмарі (MongoDB Atlas).

### Попередні вимоги:
* Встановлений [Docker](https://www.docker.com/) та Docker Compose.

### Кроки запуску:
1. Склонуйте репозиторій та перейдіть у папку проєкту:
   ```bash
   git clone <repository_url>
   cd autoria-clone

```

2. Запустіть контейнери командою:
```bash
docker-compose up -d --build

```


3. Платформа буде доступна за адресами:
* **Frontend:** http://localhost:3001
* **Backend API:** http://localhost:3000
* **Swagger UI:** http://localhost:3000/api/docs



---

## 🔑 Тестові доступи (Credentials)

Для зручної перевірки функціоналу платформи база даних вже містить попередньо створених користувачів. Використовуйте ці дані для входу:

| Роль | Ім'я | Email (Логін) | Пароль |
| --- | --- | --- | --- |
| **Адміністратор** | admin | `admin@gmail.com` | `admin@gmail.com` |
| **Менеджер** | manager | `manager@gmail.com` | `manager@gmail.com` |
| **Продавець (Преміум)** | saller1 | `saller1@gmail.com` | `saller1@gmail.com` |
| **Продавець (Базовий)** | sanya | `sanya@gmail.com` | `sanya@gmail.com` |

```

```