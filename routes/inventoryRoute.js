// Needed Resources 
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const classificationValidation = require("../utilities/classification-validation")
const inventoryValidation = require("../utilities/inventory-validation")


const invController = require("../controllers/invController")
// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
//Route to build vehicle details by vehicle view
router.get("/detail/:vehicleId", utilities.handleErrors(invController.buildDetailsByInvId))
// Route to build the vehicle management
router.get("/", utilities.handleErrors(invController.buildManagement))

//route to build the add classification
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification))

// Route to build the add inventory
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory))
// Route to add a new classification

router.post(
  "/add-classification",
  classificationValidation.registationRules(),
  classificationValidation.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

// Route to add a new vehicle to the inventory

router.post(
  "/add-inventory",
  inventoryValidation.registationRules(),
  inventoryValidation.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

// Route to get the inventory by classification_id

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Route to get the inventory edit view by inv_id

router.get("/edit/:inv_id", utilities.handleErrors(invController.editInventoryView))

// Route to process the inventory update

router.post("/update/", inventoryValidation.newInventoryRules(), inventoryValidation.checkUpdateData, utilities.handleErrors(invController.updateInventory))

// Route to get the inventory delete view by inv_id

router.get("/delete/:inv_id", utilities.handleErrors(invController.buildDeleteItem))

// Route to process the inventory delete

router.post("/erase/", utilities.handleErrors(invController.deleteInventoryItem))


module.exports = router;