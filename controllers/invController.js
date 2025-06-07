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

  const classificationSelect = await utilities.buildClassificationList()

  res.render("inventory/management", {
    title: title,
    nav,
    classificationSelect,
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
      classificationSelect,
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


/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}


/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemDataArray = await invModel.getDetailsByInvId(inv_id)
  itemData = itemDataArray[0]
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}


/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}


/* ***************************
 *  Build delete confirmation view
 * ************************** */
invCont.buildDeleteItem = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemDataArray = await invModel.getDetailsByInvId(inv_id)
  itemData = itemDataArray[0]
  
  const itemName = `${itemData.inv_make} ${itemData.inv_model} ${itemData.inv_year}`
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
    classification_id: itemData.classification_id
  })
}



/* ***************************
 *  Delete Inventory Data
 * ************************** */
invCont.deleteInventoryItem = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id, inv_make, inv_model, inv_year, inv_price
  } = req.body
  const deleteResult = await invModel.deleteInventory(
    inv_id
  )

  if (deleteResult) {
    const itemName = inv_make + " " + inv_model
    req.flash("notice", `The ${itemName} was successfully deleted.`)
    res.redirect("/inv/")
  } else {
    
    const itemName = `${inv_make} ${inv_model} ${inv_year}`
    req.flash("notice", "Sorry, the deletion failed.")
    res.status(501).render("inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_price
    })
  }
}




  module.exports = invCont