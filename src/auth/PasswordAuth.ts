import * as mongoose from 'mongoose';
import * as koa from 'koa';
import koaJwt from 'koa-jwt';

const mongoURI = process.env.HACKER_CREDS_DB as string;
mongoose
  .connect(
    mongoURI,
    { useNewUrlParser: true }
  )
  .catch(() => {
    console.error.bind(console, 'failed to connect to db');
  });

const hackerCreds = mongoose.connection.model(
  'HackerCreds',
  new mongoose.Schema({
    username: String,
    password: String,
  })
);

export const loginHandler = (req: koa.Request, res: koa.Response): void => {
  const usr = req.get('username') || '';
  if (
    !hackerCreds.countDocuments({
      username: usr,
      password: req.get('password'),
    })
  ) {
    res.status = 403;
    res.message = 'invalid username/password';
    return;
  }

  const token = koaJwt({
    secret: process.env.JWT_SIGNATURE as string,
  });

  res.status = 200;
  res.body = token;
  return;
};
