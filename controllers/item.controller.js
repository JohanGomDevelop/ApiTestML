const catchAsync = require("../utils/catchAsync");
const {formatResponse, formatError} = require("../utils/formatResponse");
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const fetch = require('node-fetch');

function formatData(itemRespose, descriptionResponse){
  let picture ="";
  if(itemRespose.pictures!=undefined && itemRespose.pictures.length>0){
    let img = itemRespose.pictures[0];
    picture =img.url?img.url:"";
  }
  if(itemRespose.thumbnail!=undefined ){
    picture = itemRespose.thumbnail;
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
      decimals: itemRespose.price?String(itemRespose.price):"",
    },
    picture: picture,
    condition: itemRespose.condition?itemRespose.condition:"",
    free_shipping: free_shipping,
    sold_quantity: itemRespose.sold_quantity?itemRespose.sold_quantity:0,
  };
  if(descriptionResponse){
    item['description'] = descriptionResponse.plain_text?descriptionResponse.plain_text:"";
  }
  return {item};
}

function formatCategory(filter){
  let array = filter.values;
  let text="";
  let list =[];
  array = array.sort((a, b) => {
    return  b.results - a.results ;
  });
  let length = array.length >3?3:array.length;
  for (let index = 0; index < length; index++) {
    const element = array[index];
    let separate = (index < length -1)? " | ":"";
    text = text + (element.name + separate );
  }
 return text;
}


function formatDataSearch(jsonResult){
  let categories = [];
  let items = [];
  let results =  jsonResult['results'];
  for (let element of results) {
      items.push(formatData(element, null));
  }
  let filters =  jsonResult['available_filters'];
  for (let element of filters) {
    categories.push(formatCategory(element));
  }

  return {items, categories}
}

exports.getItemId = catchAsync(async (req, res) => {
  const { id } = req.params;
  const urlItem = config.urlGetItem + "/" +id;
  const urlDescription = config.urlGetItem + "/" +id+"/description";
  console.log("urlItem",urlItem);
  var requestOptions = { method: 'GET'};
  let responseItem = await fetch(urlItem, requestOptions);
  let jsonItem =  await responseItem.json();
  if(responseItem.status == 200){
    let responseDescription = await fetch(urlDescription, requestOptions);
    let jsonDescription = await responseDescription.json();
    return res.status(200).send(formatResponse(formatData(jsonItem, jsonDescription)));
  }else{
    return res.status(404).send(formatError(responseItem.status, jsonItem));
  }
});

exports.getItemSearch = catchAsync(async (req, res) => {
  const { q } = req.query;
  const urlSearch = config.urlSearch + decodeURI("?q="+q.replace(' ','')+"&limit=4");
  var requestOptions = { method: 'GET', redirect: 'follow', compress: false};
  let responseSearch = await fetch(urlSearch, requestOptions);
  let jsonSearch =  await responseSearch.json();
  if(responseSearch.status == 200){
     return res.status(200).send(formatResponse(formatDataSearch(jsonSearch)));
  }else{
    return res.status(404).send(formatError(responseSearch.status, jsonSearch));
  }
});

