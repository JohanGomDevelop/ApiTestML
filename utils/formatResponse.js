const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];

exports.formatResponse= (data)=>{
  let response =   {
      author: {
        name:  config.name,
        lastname: config.lastname
      },
      ...data
  }
  return response;
}



exports.formatError=  ( code, error ) =>{
  let response =   {
      code: code,
      error: error
  }
  return response;
}
