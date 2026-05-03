import React, { JSX } from 'react';
// У реальному проєкті ми б встановили DOMPurify: 
// npm install dompurify @types/dompurify
import DOMPurify from 'dompurify';

type UserComment = {
  id: string;
  author: string;
  content: string; // Рядок, який може містити зловмисний HTML/JS код
};

// Моделюємо ситуацію: бекенд повернув нам коментар хакера
const mockMaliciousData: UserComment = {
  id: '1',
  author: 'Hacker',
  // Цей рядок містить XSS-атаку. 
  // Якщо його вставити як HTML, скрипт (alert) виконається.
  content: `<img src="x" onerror="alert('Ваш токен вкрадено!')" /><b>Гарна транзакція!</b>`,
};

// ❌ АНТИПАТЕРН: Вразливий компонент (XSS Vulnerability)
export const VulnerableComponent = ({ comment }: { comment: UserComment }): JSX.Element => {
  return (
    <div style={{ border: '1px solid red', padding: '10px' }}>
      <h4>Вразливий підхід ❌</h4>
      <p>Коментар від: {comment.author}</p>
      {/* НІКОЛИ ТАК НЕ РОБІТЬ з даними, що приходять від користувачів або стороннього бекенду без санітизації! */}
      <div dangerouslySetInnerHTML={{ __html: comment.content }} />
    </div>
  );
};

// ✅ ПАТЕРН 1: Безпечний рендер простого тексту (Escaping)
export const SafeTextComponent = ({ comment }: { comment: UserComment }): JSX.Element => {
  return (
    <div style={{ border: '1px solid green', padding: '10px' }}>
      <h4>Безпечний підхід (тільки текст) ✅</h4>
      <p>Коментар від: {comment.author}</p>
      {/* 
        React автоматично "екранує" (escapes) будь-який текст. 
        HTML теги відобразяться на екрані як звичайний текст, скрипти НЕ виконаються.
        Це найбезпечніший і найпростіший спосіб.
      */}
      <div>{comment.content}</div>
    </div>
  );
};

// ✅ ПАТЕРН 2: Безпечний рендер HTML з санітизацією (Sanitization)
export const SafeHtmlComponent = ({ comment }: { comment: UserComment }): JSX.Element => {
  // DOMPurify видаляє всі небезпечні теги (як <script>) та атрибути (як onerror, onload),
  // залишаючи тільки безпечний HTML (наприклад, <b>, <i>, <p>).
  const sanitizedHtml: string = DOMPurify.sanitize(comment.content);

  return (
    <div style={{ border: '1px solid blue', padding: '10px' }}>
      <h4>Безпечний підхід (HTML) ✅</h4>
      <p>Коментар від: {comment.author}</p>
      <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
    </div>
  );
};

// ❌ АНТИПАТЕРН: Вразливість у посиланнях (URL Injection / "javascript:" URI)
export const VulnerableLink = ({ userUrl }: { userUrl: string }): JSX.Element => {
  // Якщо userUrl === "javascript:alert('XSS')", клік по посиланню виконає скрипт.
  return <a href={userUrl}>Відкрити чек (вразливе) ❌</a>;
};

// ✅ ПАТЕРН 3: Безпечне посилання
export const SafeLink = ({ userUrl }: { userUrl: string }): JSX.Element => {
  // Перевіряємо, чи посилання починається з безпечних протоколів (http або https)
  const isSafeUrl = (url: string): boolean => {
    try {
      const parsedUrl = new URL(url, window.location.origin);
      return ['http:', 'https:'].includes(parsedUrl.protocol);
    } catch {
      return false; // Якщо URL невалідний
    }
  };

  const safeHref = isSafeUrl(userUrl) ? userUrl : '#';

  return <a href={safeHref}>Відкрити чек (безпечне) ✅</a>;
};

export const SecurityDemo = (): JSX.Element => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px' }}>
      <h2>Демонстрація Frontend Security</h2>
      
      <VulnerableComponent comment={mockMaliciousData} />
      <SafeTextComponent comment={mockMaliciousData} />
      <SafeHtmlComponent comment={mockMaliciousData} />
      
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        <VulnerableLink userUrl="javascript:alert('Зламано через лінку!')" />
        <SafeLink userUrl="javascript:alert('Зламано через лінку!')" />
      </div>
    </div>
  );
};
