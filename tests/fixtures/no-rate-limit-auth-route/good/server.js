import express from 'express';
const app = express();
app.post('/login', (req, res) => {
  res.send('ok');
});
