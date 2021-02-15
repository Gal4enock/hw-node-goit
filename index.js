const cors = require('cors');
const express = require('express');
const { PORT } = require('./assets/constants');
const contactsRouter = require('./routes/contacts.routes');
const usersRouter = require('./routes/user.routes');


const app = express();
app.use(cors({
  origin: '*',
}));
app.use(express.json());
app.use('/api/contacts', contactsRouter);
app.use('/auth', usersRouter)


app.get('/api/contacts', (req, res, next) => {
  res.json({message: 'CORS is activated'})
})

app.listen(PORT, () => {
  console.log('Listening with CORS on port..', PORT);
})
