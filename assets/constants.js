const HttpCodes = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_AUTORIZED: 401,
  NOT_FOUND: 404
}

const PORT = process.env.PORT || 3000;

module.exports = {
  HttpCodes,
  PORT
}