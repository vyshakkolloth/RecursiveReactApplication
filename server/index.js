const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const app = express();
const routes = require('./routes.js');
const globalErrorHandler = require('./middlewares/errorHandler.js');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.use(cors({
  origin: 'https://recursive-react-application.vercel.app/',
  credentials: true
}));
// Routes
app.use('/api', routes);

app.get("/api/healthcheck", (req, res) => {
      const formatBytes = (bytes, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
      };
      const { rss, heapTotal, heapUsed } = process?.memoryUsage();
      const currentTime = new Date().toISOString();
      res.status(200).json({
        status: "OK",
        memoryUsage: {
          rss: formatBytes(rss),
          heapTotal: formatBytes(heapTotal),
          heapUsed: formatBytes(heapUsed),
        },
        timezone: process?.env?.TZ,
        currentTime: currentTime,
      });
    
    });

  
app.use(globalErrorHandler);




const connectDB= async()=>{

mongoose.set('strictQuery',true)
mongoose.connect(process.env.MONGO).then(()=>console.log("mongoose connected")).catch((err)=>{
    console.log("DB error",err)
})

}
connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
   
  console.log(`Server running on port ${PORT}`);
});
