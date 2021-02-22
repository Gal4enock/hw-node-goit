const cors = require('cors');
const express = require('express');
const { PORT } = require('./assets/constants');
const multer = require('multer');
const contactsRouter = require('./routes/contacts.routes');
const usersRouter = require('./routes/user.routes');

const upload = multer({dest: 'public/images/'})

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'public/images/')
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + '-' + Date.now())
//   }
// })
 
// const upload = multer({ storage })

const app = express();
app.use('/images', express.static('public'));

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
