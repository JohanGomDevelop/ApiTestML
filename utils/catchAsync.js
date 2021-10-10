module.exports = fn => {
  return (req, res) => {
      fn(req, res)
       .catch((fnError) => {
          console.log(fnError.message);
          return res.status(400).send({
              success: false,
              codigo: 400,
              error:fnError.message
          });
       })
};
};
