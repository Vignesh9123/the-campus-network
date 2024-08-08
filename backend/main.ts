const express = require('express');
const app = express();
const PORT = 3000;
const cors = require('cors');
const bodyParser = require('body-parser');
const signupRouter = require('./routes/signup');
app.use(cors());
app.use(bodyParser.json());

app.use('/signup', signupRouter);
app.get('/', (req:any, res:any) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});