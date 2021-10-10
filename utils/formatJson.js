
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

exports.formatItem = (itemRespose, descriptionResponse) =>{
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




exports.formatDataSearch = (jsonResult) => {
  let categories = [];
  let items = [];
  let results =  jsonResult['results'];
  for (let element of results) {
      items.push(this.formatItem(element, null));
  }
  let filters =  jsonResult['available_filters'];
  for (let element of filters) {
    categories.push(formatCategory(element));
  }
  return {categories, items };
}
