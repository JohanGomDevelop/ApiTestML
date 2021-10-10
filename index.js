const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const cors = require('cors')({
  origin: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'Content-Length', 'X-Requested-With', 'Accept'],
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  });


app.use(express.urlencoded({ extended: true, limit: '50mb',
parameterLimit: 500000 }));
app.use(express.text({ limit: '50mb' }));
app.use(cors);
let route = require('./routes/api');
app.use('/api', route);

app.all("*", (req, res, next) => {
  let respuesta = {
      error: true,
      codigo: 404,
      mensaje: 'URL no encontrada'
      };
      return  res.status(404).send(respuesta);
});


app.listen(port, ()=>{
})





