const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

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
  console.log("Mi port "+ port);
})





