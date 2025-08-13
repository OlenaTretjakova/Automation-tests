# Sauce Demo E2E Tests

Цей проект містить автоматизовані end-to-end тести для веб-додатку Sauce Demo, написаних з використанням WebdriverIO та Page Object Model (POM) патерну.

## Структура проекту

```
├── test/
│   ├── pageobjects/          # Page Object Model
│   │   ├── LoginPage.js      # Сторінка логіну
│   │   ├── InventoryPage.js  # Сторінка інвентаря
│   │   ├── CartPage.js       # Сторінка корзини
│   │   └── CheckoutPage.js   # Сторінка оформлення замовлення
│   ├── utils/
│   │   └── helpers.js        # Допоміжні функції
│   └── specs/
│       └── test.e2e.js       # Тестові сценарії
├── wdio.conf.js              # Конфігурація WebdriverIO
├── package.json              # Залежності проекту
└── README.md                 # Документація
```

## Встановлення

1. Клонуйте репозиторій
2. Встановіть залежності:
```bash
npm install
```

## Запуск тестів

Для запуску всіх тестів:
```bash
npm run wdio
```

## Особливості реалізації

### Page Object Model (POM)
- **LoginPage**: Управління логіном та обробка помилок авторизації
- **InventoryPage**: Робота з продуктами, сортування, соціальні мережі
- **CartPage**: Управління корзиною
- **CheckoutPage**: Оформлення замовлення

### Тестові сценарії

1. **Login Tests** - тестування авторизації
2. **Burger Menu Tests** - тестування меню навігації
3. **Cart Persistence Tests** - тестування збереження корзини
4. **Product Sorting Tests** - тестування сортування продуктів
5. **Social Media Links Tests** - тестування соціальних мереж
6. **Order Completion Tests** - тестування оформлення замовлення
7. **Empty Cart Tests** - тестування порожньої корзини
8. **Password Limitation Tests** - тестування обмежень пароля
9. **Form Validation Tests** - тестування валідації форм

## Технології

- **WebdriverIO** - фреймворк для автоматизації тестування
- **Mocha** - тестовий фреймворк
- **Chrome** - браузер для тестування
- **Page Object Model** - патерн проектування для тестів
