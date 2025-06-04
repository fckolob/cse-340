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
  res.render("inventory/classification", {
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
  
  res.render("inventory/vehicle", {
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

  res.render("inventory/management", {
    title: title,
    nav,
    errors: null
  })
}

// Build add classification view

invCont.buildAddClassification = async function(req, res, next){
  let nav = await utilities.getNav() 
  const title = "Add New Classification"

  res.render("inventory/add-classification", {
    title: title,
    nav,
    errors: null
  })
}

// Process add classification

invCont.addClassification = async function(req, res){
  let nav = await utilities.getNav()
  const {classification_name} = req.body


const addResult = await invModel.addClassification(classification_name)

  if (addResult) {
    req.flash(
      "notice",
      `Congratulations, the classification ${classification_name} has been added.`
    )
    res.status(201).render("inventory/management", {
      title: "Management",
      nav,
      errors: null
    })
  } else {
    req.flash("notice", "Sorry, the classification addition failed")
    res.status(501).render("inventory/add-classification", {
      title: "Add a new classification",
      nav,
      errors: null
    })
  }
  
}

invCont.buildAddInventory = async function(req, res, next) {
  let nav = await utilities.getNav()
  let classificationSelect = await utilities.buildClassificationList()
  const title = "Add New Vehicle"
  


  res.render("inventory/add-inventory", {
    title: title,
    nav,
    classificationSelect,
    inv_make: "",
    inv_model: "",
    inv_year: "",
    inv_description: "",
    inv_image: "",
    inv_thumbnail: "",
    inv_price: "",
    inv_miles: "",
    inv_color: "",
    classification_id: "",
    errors: null
  })
}


invCont.addInventory = async function(req, res){
  let nav = await utilities.getNav()
  const {inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id} = req.body

  
  let classificationSelect = await utilities.buildClassificationList(classification_id)
  if (!classificationSelect) classificationSelect = "<select name='classification_id' id='classificationList'><option value=''>No classifications found</option></select>"

  const title = "Add a New Vehicle"

  const addResult = await invModel.addInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)

  if (addResult) {
    req.flash(
      "notice",
      `Congratulations, vehicle ${inv_make} ${inv_model} ${inv_year} has been added.`
    )
    res.status(201).render("inventory/management", {
      title: "Management",
      nav,
      errors: null
    })
  } else {
    req.flash("notice", "Sorry, the vehicle addition failed")
    res.status(501).render("inventory/add-inventory", {
      title: title,
      nav,
      classificationSelect,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
      errors: null
    })
  }
}


  module.exports = invCont