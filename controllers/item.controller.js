const catchAsync = require("../utils/catchAsync");
const {formatResponse, formatError} = require("../utils/formatResponse");
const {formatDataSearch, formatItem, formatCategoryItem} = require("../utils/formatJson");
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const fetch = require('node-fetch');

exports.getItemId = catchAsync(async (req, res) => {
  const { id } = req.params;
  const urlItem = config.urlGetItem + "/" +id;
  const urlDescription = config.urlGetItem + "/" +id+"/description";
  var requestOptions = { method: 'GET'};
  let responseItem = await fetch(urlItem, requestOptions);
  let jsonItem =  await responseItem.json();
  if(responseItem.status == 200){
    let responseDescription = await fetch(urlDescription, requestOptions);
    let jsonDescription = await responseDescription.json();
    const urlCategory = config.urlCategory + "/" +jsonItem.category_id;
    let responseCategory = await fetch(urlCategory, requestOptions);
    let jsonCategory = await responseCategory.json();
    let data = formatItem(jsonItem, jsonDescription);
    data["categories"] = formatCategoryItem(jsonCategory);
    return res.status(200).send(formatResponse(data));
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

