const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul class='navigation-ul'>"
  list += '<li class="navigation-li"><a class="nav-a" href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li class='navigation-li'>"
    list +=
      '<a class="nav-a" href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}


/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li class="inv-li">'
      grid +=  '<a class="inv-a" href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img class="inv-img" src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2 class="vehicle-name">'
      grid += '<a class= "vehicle-a" href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span class="vehicle-price">$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the classification view HTML
* ************************************ */

Util.buildDetailsGrid = async function(data) {
  let detailsGrid 
  if (data){
    detailsGrid = '<div id="details-display">'
    detailsGrid += `<h1 id="details-title">${data.inv_year} ${data.inv_make} ${data.inv_model}<h1/>`
    detailsGrid += `<img id="details-img" src="${data.inv_image}" alt="${data.inv_make} ${data.inv_model} ${data.inv_year}"/>`
    detailsGrid += '<span id="details-price">$' 
      + new Intl.NumberFormat('en-US').format(data.inv_price) + '</span>'
    detailsGrid += `<p id="details-description">${data.inv_description}</p>`
    detailsGrid += `<h2 id="details-miles">${data.inv_miles} Miles</h2>`
    detailsGrid += `<h2 id="details-color">${data.inv_color}</h2>`
  }
  return detailsGrid
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util