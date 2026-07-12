const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(__dirname)); // отдаёт index.html, style.css, script.js

const LOG_FILE = path.join(__dirname, 'visitors.json');

app.post('/api/track', (req, res) => {
  const ip = req.headers['x-forwarded-for']?.split(',')[0].trim()
             || req.socket.remoteAddress;

  const visitorData = {
    ip,
    userAgent: req.body.userAgent,
    language: req.body.language,
    timezone: req.body.timezone,
    referrer: req.body.referrer,
    timestamp: new Date().toISOString()
  };

  console.log('Новый визит:', visitorData);

  // Сохраняем в файл (добавляем в массив)
  let visitors = [];
  if (fs.existsSync(LOG_FILE)) {
    visitors = JSON.parse(fs.readFileSync(LOG_FILE, 'utf-8'));
  }
  visitors.push(visitorData);
  fs.writeFileSync(LOG_FILE, JSON.stringify(visitors, null, 2));

  res.json({ status: 'ok' });
});

app.listen(3000, () => console.log('Сервер запущен: http://localhost:3000'));
