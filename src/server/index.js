import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';

import schema from 'schema';
import models from 'config/database';
import constants from 'config/constants';

const app = express();

app.use(bodyParser.json());
app.use(cookieParser(constants.COOKIE_SECRET, {
  httpOnly: true
}));

app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql'
}));

app.use('/graphql', graphqlExpress((req, res) => ({
  schema,
  context: {
    req,
    res,
    models
  }
})));

models.sequelize.sync().then(() => {
  app.listen(constants.PORT, () => { console.log(`Server running on port: ${constants.PORT}`); });
});
