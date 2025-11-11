const express = require('express');
const bodyParser = require('body-parser');

const mongodb = require('./data/database');
const app = express();

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/', require('./routes'));

process.on('uncaughtException', (err, origin) => {
  console.error(`Uncaught Exception: ${err.message}`);
  console.error(`Stack Trace: ${err.stack}`);
  console.error(`Origin: ${origin}`);
});

mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port, () => {
      console.log(`Database is listening and node Running on port ${port}`);
    });
  }
});
