const CONSENT_KEY = 'cookie_consent';

// Проверяем, было ли уже дано согласие
function getConsent() {
  return localStorage.getItem(CONSENT_KEY); // 'accepted' | 'declined' | null
}

function setConsent(value) {
  localStorage.setItem(CONSENT_KEY, value);
}

// Показываем баннер, если решения ещё не было
window.addEventListener('DOMContentLoaded', () => {
  if (!getConsent()) {
    document.getElementById('cookieBanner').style.display = 'flex';
  }
});

document.getElementById('acceptCookies').addEventListener('click', () => {
  setConsent('accepted');
  document.getElementById('cookieBanner').style.display = 'none';
});

document.getElementById('declineCookies').addEventListener('click', () => {
  setConsent('declined');
  document.getElementById('cookieBanner').style.display = 'none';
});

// Отправка данных — только если согласие дано
document.getElementById('trackBtn').addEventListener('click', async () => {
  if (getConsent() !== 'accepted') {
    alert('Для продолжения необходимо принять использование данных.');
    document.getElementById('cookieBanner').style.display = 'flex';
    return;
  }

  const data = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    referrer: document.referrer || 'direct'
  };

  try {
    const response = await fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    console.log('Отправлено:', result);
  } catch (err) {
    console.error('Ошибка отправки:', err);
  }
});
