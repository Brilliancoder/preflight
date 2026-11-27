import express from 'express';
const app = express();
app.get('/login', (req, res) => {
  res.redirect(req.query.returnTo);
});





