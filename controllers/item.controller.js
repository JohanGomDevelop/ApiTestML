const catchAsync = require("../utils/catchAsync");
const {formatResponse, formatError} = require("../utils/formatResponse");
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const fetch = require('node-fetch');

function formatData(itemRespose, descriptionResponse){
  let picture ="";
  if(itemRespose.pictures.length>0){
    let img = itemRespose.pictures[0];
    picture =img.url?img.url:"";
  }
  let free_shipping= false;
  if(itemRespose.shipping){
    free_shipping =itemRespose.shipping.free_shipping!=undefined?itemRespose.shipping.free_shipping:false;
  }
  let item ={
    id: itemRespose.id?itemRespose.id:"",
    title: itemRespose.title?itemRespose.title:"",
    price: {
      currency: itemRespose.price?String(itemRespose.price):"",
      amount: itemRespose.price?itemRespose.price:0,
      decimals: itemRespose.available_quantity?itemRespose.available_quantity:0,
    },
    picture: picture,
    condition: itemRespose.condition?itemRespose.condition:"",
    free_shipping: free_shipping,
    sold_quantity: itemRespose.sold_quantity?itemRespose.sold_quantity:0,
    description: descriptionResponse.plain_text?descriptionResponse.plain_text:"",
  }
  return {item};
}

exports.getItemId = catchAsync(async (req, res) => {
  const { id } = req.params;
  const urlItem = config.urlGetItem + "/" +id;
  const urlDescription = config.urlGetItem + "/" +id+"/description";
  var requestOptions = { method: 'GET'};
  let responseItem = await fetch(urlItem, requestOptions);
  let jsonItem = await responseItem.json();
  if(responseItem.status == 200){
    let responseDescription = await fetch(urlDescription, requestOptions);
    let jsonDescription = await responseDescription.json();
    return res.status(200).send(formatResponse(formatData(jsonItem, jsonDescription)));
  }else{
    return res.status(404).send(formatError(responseItem.status, jsonItem));
  }
});



