module.exports = fn => {
  return (req, res) => {
      fn(req, res)
       .catch((fnError) => {
          return res.status(400).send({
              success: false,
              codigo: 400,
              error:fnError.message
          });
       })
};
};
