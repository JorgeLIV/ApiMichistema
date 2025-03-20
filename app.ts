require('dotenv').config();
import express from 'express';
import authroutes from './routes/auth';  
import userroutes from './routes/user';
import deviceroutes from './routes/device';
import statsroutes from './routes/stats';
import environmentroutes from './routes/environments';
import configurationroutes from './routes/configurations';

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

app.use('/v1/api/users/', userroutes);  
app.use('/v1/api/auth/', authroutes);
app.use('/v1/api/device/', deviceroutes);  
app.use('/v1/api/stats/', statsroutes);  
app.use('/v1/api/environments/', environmentroutes);  
app.use('/v1/api/configurations/', configurationroutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log('Press ctrl + c to stop the server');
}); 