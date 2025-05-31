const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    errors: null
  })
}

// Build details view by inventory id.

invCont.buildDetailsByInvId = async function (req, res, next) {
  const inv_id = req.params.vehicleId
  const data = await invModel.getDetailsByInvId(inv_id)
  const grid = await utilities.buildDetailsGrid(data[0])
  let nav = await utilities.getNav()
  const vehicleName = data[0].inv_make + " " + data[0].inv_model
  
  res.render("./inventory/vehicle", {
    title: vehicleName,
    nav,
    grid,
    errors: null
  })
}

// Build management view

invCont.buildManagement = async function(req, res, next){
  let nav = await utilities.getNav() 
  const title = "Vehicle Management"

  res.render("./inventory/management", {
    title: title,
    nav,
    errors: null
  })
}

  module.exports = invCont