# Стратегія підготовки до Qonto: Senior Frontend Engineer

Цей план розрахований на 3 дні глибокого занурення у технічні та культурні стандарти Qonto. Мета — продемонструвати не лише навички кодування, але й мислення інженера-власника (Owner), який відповідає за якість, бізнес-цінність та архітектуру.

---

## День 1: Майстерність Code Review та AI

### 10 пунктів для Senior-level Code Review (Стандарт Qonto)

Під час Live Code Review інтерв'юери дивляться не на те, як ви знаходите пропущені крапки з комою, а на те, як ви оцінюєте систему в цілому:

1. **Архітектура та стан (State Management):** Чи не піднятий стан занадто високо? Чи немає надмірного використання глобального стану (Redux/Zustand) там, де вистачить локального?
2. **Продуктивність React (Re-renders):** Чи правильно використовуються `useMemo` та `useCallback`? Чи є ризик нескінченних циклів у `useEffect` через неправильні залежності?
3. **Витоки пам'яті (Memory Leaks):** Чи очищаються підписки, таймери (`setInterval`/`setTimeout`) та event listeners у функції cleanup `useEffect`?
4. **Семантика HTML:** Чи використовуються правильні теги (`<button>`, `<nav>`, `<section>`) замість безкінечних `<div>`? Це впливає на SEO та доступність.
5. **Доступність (Accessibility - a11y):** Чи є клавіатурна навігація (tabIndex, обробка Enter/Space)? Чи присутні `aria-` атрибути для складних віджетів? Чи є `alt` у зображень?
6. **Специфічність CSS та стилізація:** Чи немає хардкоду стилів (`!important`), глибокої вкладеності селекторів? Чи правильно використовуються дизайн-токени?
7. **Безпека (Security / XSS):** Чи є використання `dangerouslySetInnerHTML` без санітизації (наприклад, DOMPurify)? Чи зовнішні посилання мають `rel="noopener noreferrer"`?
8. **Тестованість (Testability):** Чи винесена бізнес-логіка з компонентів у чисті функції (pure functions) або кастомні хуки для полегшення unit-тестування (щоб досягти 90% покриття)?
9. **Обробка помилок (Error Handling):** Як компонент поводиться при падінні API? Чи є Error Boundaries, fallback UI, чи стан завантаження (skeleton loaders)?
10. **Чистота та конвенції:** Чи зрозумілий неймінг? Чи відсутні "магічні числа"? Чи використовується патерн "early return" для уникнення глибокої вкладеності `if/else`?

### Практика Code Review

Я створив файл `qonto-interview/CodeReviewPractice.jsx` у твоєму проєкті.
**Завдання:** Відкрий його, увімкни запис екрану/аудіо і прокоментуй код вголос англійською, ніби ти на інтерв'ю. Спробуй знайти всі 9 прихованих багів.

### Аргументація використання AI (Cursor/Copilot) "The Qonto Way"

Qonto заохочує використання AI ("push AI beyond the obvious"), але вимагає відповідальності. Твоя позиція має бути наступною:

* *"Я розглядаю AI як дуже швидкого, але наївного Junior-розробника в парі. Він ідеально підходить для генерації бойлерплейту, написання рутинних unit-тестів (що критично для 90% coverage) або створення чорнових варіантів міграції зі старих патернів на нові."*
* *"Але ключова цінність Senior-інженера — це **Architectural Judgment** та **Ownership**. AI може запропонувати 3 варіанти компонента, але я приймаю рішення, який з них краще масштабується, відповідає нашій дизайн-системі та вимогам безпеки."*
* *"Я використовую AI для зворотного рев'ю: після написання складного алгоритму або тестів, я прошу Cursor знайти 'сліпі зони' (edge cases), які я міг пропустити. Це допомагає дотримуватися принципу Right First Time."*

---

## День 2: "The Qonto Way" та поведінкові кейси

### Методології Qonto (простими словами)

* **Kaizen (Безперервне покращення):** Це культура, де ніхто не чекає "ідеального моменту" для рефакторингу. У фронтенді це означає: побачив застарілий компонент — онови його. Помітив, що CI-пайплайн іде на 1 хвилину довше — знайди спосіб прискорити його на 10 секунд. Це щоденні мікро-покращення (видалення мертвого коду, покращення доступності), які з часом дають величезний результат.
* **PDCA (Plan-Do-Check-Act):** Фреймворк вирішення проблем.
  * **Plan:** Бачимо проблему (наприклад, повільний First Contentful Paint). Ставимо ціль (покращити на 20%).
  * **Do:** Робимо PoC (Proof of Concept) у маленькому ізольованому PR (наприклад, додаємо lazy-loading картинок).
  * **Check:** Перевіряємо метрики (Lighthouse/Datadog). Працює?
  * **Act:** Якщо так — масштабуємо на весь застосунок і оновлюємо документацію (стандартизуємо). Якщо ні — повертаємося до Plan.
* **Smart Slicing:** Мистецтво розбивати великі завдання на найменші, незалежні шматки, що несуть цінність. У контексті міграції на React до 2026 року: ми не "переписуємо все і релізимо через рік". Ми мігруємо один віджет, одну сторінку, деплоїмо за фіче-флагом, збираємо фідбек, і йдемо далі.

### 5 Ситуативних питань (Behavioral Questions) для підготовки

1. **Незгода з лідом (Ownership / Teamspirit):** "Tell me about a time you strongly disagreed with your Tech Lead or Product Manager regarding an architectural decision or technical approach. How did you navigate the situation, and what was the outcome?"
2. **Проактивність (Kaizen):** "Describe a situation where you identified a recurring technical issue or process bottleneck that wasn't officially on your roadmap. How did you advocate for fixing it without jeopardizing your sprint goals?"
3. **Крос-функціональна співпраця:** "Tell me about a time when Product, Design, and Engineering had conflicting priorities (e.g., speed vs. quality/design fidelity). How did you step in to align the team and ensure successful delivery?"
4. **Робота з міграціями (Smart Slicing / PDCA):** "Walk me through a complex technical migration or refactoring initiative you led. How did you break down the work, and how did you ensure new features could still be shipped during the process?"
5. **Якість vs Швидкість (Right First Time):** "Describe a scenario where you were pressured to deliver a feature quickly, but you knew the approach would introduce significant technical debt. How did you balance the business need for speed with high engineering standards?"

---

## День 3: Симуляція та стратегія

Цей день ми присвятимо мок-інтерв'ю. Напиши мені: *"Почнімо мок-інтерв'ю для Дня 3"*, і я буду ставити тобі питання по одному, чекати на твою відповідь, і давати жорсткий, конструктивний фідбек з позиції інтерв'юера Qonto.

### Чек-лист перед інтерв'ю (Setup)

* [ ] **IDE / Editor:** Відкрий редактор, вимкни непотрібні плагіни, які можуть відволікати (або зливати інформацію). Якщо використовуєш Cursor, переконайся, що ти готовий коментувати його автодоповнення.
* [ ] **Шрифт та тема:** Збільш розмір шрифту (14-16px мінімум), щоб інтерв'юерам було добре видно на екрані. Використовуй контрастну тему.
* [ ] **Сповіщення:** Вимкни сповіщення Slack, Telegram, Email (Do Not Disturb mode).
* [ ] **Браузер:** Приготуй чисте вікно браузера (бажано окремий профіль без особистих закладок) з відкритою консоллю розробника.
* [ ] **Screen Share:** Перевір дозволи MacOS (System Settings -> Privacy & Security -> Screen Recording) для Zoom/Google Meet.
* [ ] **Вода:** Постав склянку води поруч. Зробити ковток — це легальний спосіб отримати 3 секунди на обдумування складної відповіді.
