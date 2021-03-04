const mongoose = require('mongoose');
const { Types: { ObjectId } } = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const { promises: fsPromises } = require('fs');
const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');
const Avatar = require('avatar-builder');
const multer = require('multer');

const { HttpCodes } = require('../assets/constants');
const User = require('../models/User');


 


async function loginUser(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({
    email
  })

  if (!user) {
    return res.status(HttpCodes.NOT_AUTORIZED).json({"message": "Not authorized"});
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(HttpCodes.NOT_AUTORIZED).json({"message": "Not authorized"});
  }

  const token = await jwt.sign({
    userID: user._id,
  }, process.env.JWT_SECRET);

  await User.findOneAndUpdate({email}, { $set: { token } }, {
   new: true
 });

  return res.status(HttpCodes.CREATED).json({"token": token,
  "user": {
    "email": email,
    "subscription": "free"
  }});
} 

async function checkToken(req, res, next) {
  const header = req.get('Authorization');

  if (!header) {
    return res.status(HttpCodes.NOT_AUTORIZED).json({"message": "Not authorized"});
  }

  const token = header.replace('Bearer ', '');
  try {
    const payload = await jwt.verify(token, process.env.JWT_SECRET);
    const { userID } = payload;
    console.log('id', userID);
    const user = await User.findById(userID);

    if (!user) {
       return res.status(HttpCodes.NOT_AUTORIZED).json({"message": "Not authorized"});
    }
  
    req.user = user
    next();

  } catch (err) {
    return res.status(HttpCodes.NOT_AUTORIZED).json({"message": "No user"});
  }

}

async function logoutUser(req, res) {
  const user = req.user;
  const { email } = user;
  console.log("email", email);
  if (!user) {
    return res.status(HttpCodes.NOT_AUTORIZED).json({"message": "Not authorized"});
  }

  await User.findOneAndUpdate({email}, { $set: { token: '' } }, {
   new: true
 });

  return res.status(HttpCodes.NO_CONTENT).json({"message": "You're loged out"});
}

async function getUser(req, res) {
  const user = req.user;

   if (!user) {
    return res.status(HttpCodes.NOT_AUTORIZED).json({"message": "Not authorized"});
  }

  res.status(HttpCodes.OK).json({
  "email": user.email,
  "subscription": user.subscription
})
}

 async function minimize(name) {
    const files = await imagemin([`tmp/${name}.png`], {
        destination: 'public/images',
        plugins: [
            imageminPngquant({
                quality: [0.6, 0.8]
            })
        ]
    });
    };

async function createUser(req, res) {
  const name = 'someOne' + Date.now();
  try {
    const { body } = req;
    const hashPassword = await bcrypt.hash(body.password, 14);
    const doubleUser = await User.findOne({ email: body.email })
    if (doubleUser) {
      return res.status(HttpCodes.BAD_REQUEST).json({"message": "Email in use"});
    }
    const avatar = await Avatar.identiconBuilder(128);
    const catAvatar = await avatar.create(name);
    fsPromises.writeFile(`tmp/${name}.png`, catAvatar);

    minimize(name);

    await fsPromises.unlink(`tmp/${name}.png`);

    const newUser = await User.create({
      ...body,
      password: hashPassword,
      avatarURL: `localhost:3000/public/images/${name}.png`,
      token: ''
    });
  res.status(HttpCodes.CREATED).json(newUser);
  } catch (err) {
    console.log(err);
    res.status(400).send({'message': 'Something went wrong'})
  }
}

// function loadAvatar(req, res, next) {
//   const storage = multer.diskStorage({
//   name: 'someOne' + Date.now(),
//   destination: function (req, file, cb) {
//     cb(null, 'tmp/')
//   },
//   filename: function (req, file, cb) {
//     cb(null, this.name + 'png')
//   }
//   })
//   const upload = multer({ storage })
  
//   next()
//   return upload.single('avatar');
  
  
// }

async function changeFotos(req, res) {
  try {
    const user = req.user;
    if (!user) {
      return res.status(HttpCodes.NOT_AUTORIZED).json({"message": "Not authorized"})
    }
    const link = user.avatarURL.replace('localhost:3000/', '')
    fsPromises.unlink(link);
    const fileName = req.file.filename;
    await minimize(fileName.replace('.png', ''));
    await fsPromises.unlink(`tmp/${fileName}`);
    const avatarURL = `localhost:3000/images/${fileName}`
    await User.findOneAndUpdate({ _id: user._id }, { $set: { avatarURL } }, {
      new: true
    });

    res.status(HttpCodes.OK).json({
  "avatarURL": avatarURL
});

  } catch (err) {
    console.log(err);
  }

} 

function validationUser(req, res, next) {
  const validationRules = Joi.object({
    name: Joi.string(),
    email: Joi.string().required(),
    password: Joi.string().required()
  })
  
  const validationResult = validationRules.validate(req.body);
  
  if (validationResult.error) {
    return res.status(HttpCodes.BAD_REQUEST).send({"message":validationResult.error.details[0].message})
  }
  next();
} 

module.exports = {
  createUser,
  validationUser,
  loginUser,
  checkToken,
  logoutUser,
  getUser,
  changeFotos,
}