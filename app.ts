require('dotenv').config();
import express from 'express';
import authroutes from './routes/auth';  
import userroutes from './routes/user';
import deviceroutes from './routes/device';
import statsroutes from './routes/stats';
import environmentroutes from './routes/environments';
import configurationroutes from './routes/configurations';
import models from './db/models'; 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/v1/api/users/', userroutes);  
app.use('/v1/api/auth/', authroutes);
app.use('/v1/api/device/', deviceroutes);  
app.use('/v1/api/stats/', statsroutes);  
app.use('/v1/api/environments/', environmentroutes); 
app.use('/v1/api/configurations/', configurationroutes);

app.listen(PORT, '0.0.0.0', async () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('Press ctrl + c to stop the server');
  try {
    await models.sequelize.authenticate(); 
    console.log('Database connected');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});