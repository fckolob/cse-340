const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

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
else{
  detailsGrid += '<p class="notice">Sorry, no such vehicle could be found.</p>'
}
return detailsGrid
  }

  Util.buildClassificationList = async function (classification_id = null) {
    let data = await invModel.getClassifications()
    let classificationList =
      '<select class="form-input" name="classification_id" id="classificationList" required>'
    classificationList += "<option value=''>Choose a Classification</option>"
    data.rows.forEach((row) => {
      classificationList += '<option value="' + row.classification_id + '"'
      if (
        classification_id != null &&
        row.classification_id == classification_id
      ) {
        classificationList += " selected "
      }
      classificationList += ">" + row.classification_name + "</option>"
    })
    classificationList += "</select>"
    return classificationList
  }
  

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
 if (req.cookies.jwt) {
  jwt.verify(
   req.cookies.jwt,
   process.env.ACCESS_TOKEN_SECRET,
   function (err, accountData) {
    if (err) {
     req.flash("Please log in")
     res.clearCookie("jwt")
     return res.redirect("/account/login")
    }
    res.locals.accountData = accountData
    res.locals.loggedin = 1
    next()
   })
 } else {
  next()
 }
}


/* ****************************************
* Create employees table
**************************************** */
Util.createEmployeesTable = function(data){
let dataTable = '<table id="inventoryDisplay">'
dataTable += '<thead class="table-head">'; 
 dataTable += '<tr><th class="table-heading">Employee Name</th><td>&nbsp;</td><td>&nbsp;</td></tr>'; 
 dataTable += '</thead>'; 
 // Set up the table body 
 dataTable += '<tbody class="table-body">'; 
 // Iterate over all employees in the array and put each in a row 
 data.forEach((element) => { 
  dataTable += `<tr class="table-row"><td class="table-cell">${element.account_firstname} ${element.account_lastname}</td>`; 
  dataTable += `<td class="table-cell"><a href='/account/remove-confirmation/${element.account_id}' title='Click to remove'>Remove</a></td>`; 
  dataTable += `</tr>`; 
 }) 
 dataTable += '</tbody>';
 dataTable += '</table>'
 return dataTable
}

module.exports = Util