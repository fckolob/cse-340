const utilities = require(".")
const { body, validationResult } = require("express-validator")
const inventoryModel = require("../models/inventory-model")
const validate = {}

 validate.registationRules = () => {
    return body("classification_name")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .isAlpha()
        .withMessage("Please provide a valid classification name.")
        .custom(async (classification_name) => {
          const classificationExists = await inventoryModel.checkExistingClassification(classification_name)
          if (classificationExists){
          throw new Error("Classification already exists.")
          }
          })

        
 }

  /* ******************************
  * Check data and return errors or continue to create classification
  * ***************************** */
 validate.checkClassificationData = async (req, res, next) => {
   const { classification_name } = req.body
   let errors = []
   errors = validationResult(req)
   if (!errors.isEmpty()) {
     let nav = await utilities.getNav()
     res.render("inventory/add-classification", {
       errors,
       title: "Add New Classification",
       nav,
       classification_name
     })
     return
   }
   next()
}

module.exports = validate