const utilities = require(".")
const { body, validationResult } = require("express-validator")
const accountModel = require("../models/inventory-model")
const validate = {}
const path = require('path');


 validate.registationRules = () => {
    return [ body("inv_make")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 3 })
        .isAlpha()
        .withMessage("Please provide a valid make."),

        body("inv_model")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 3 })
        .isAlphanumeric()
        .withMessage("Please provide a valid model."),

        

        body("inv_year")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 4, max:4 })
        .isNumeric()
        .withMessage("Please provide a valid year."),

        body("inv_description")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        //.isAlpha()
        .withMessage("Please provide a valid description."),

        body("inv_image")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a valid image path."),

        body("inv_thumbnail")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a valid thumbnail path."),

        body("inv_price")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .isCurrency()
        .withMessage("Please provide a valid price."),

        body("inv_miles")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .isInt()
        .withMessage("Please provide a valid miles number."),

        body("inv_color")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .isAlpha()
        .withMessage("Please provide a valid color."),
    ]

        
 }


 validate.newInventoryRules = () => {
    return [ body("inv_make")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 3 })
        .isAlpha()
        .withMessage("Please provide a valid make."),

        body("inv_model")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 3 })
        .isAlphanumeric()
        .withMessage("Please provide a valid model."),

        

        body("inv_year")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 4, max:4 })
        .isNumeric()
        .withMessage("Please provide a valid year."),

        body("inv_description")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        //.isAlpha()
        .withMessage("Please provide a valid description."),

        body("inv_image")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a valid image path."),

        body("inv_thumbnail")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a valid thumbnail path."),

        body("inv_price")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .isCurrency()
        .withMessage("Please provide a valid price."),

        body("inv_miles")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .isInt()
        .withMessage("Please provide a valid miles number."),

        body("inv_color")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .isAlpha()
        .withMessage("Please provide a valid color."),
    ]

        
 }



  /* ******************************
  * Check data and return errors or continue to add to inventory
  * ***************************** */
 validate.checkInventoryData = async (req, res, next) => {
   
   const { inv_make, inv_model, inv_year, inv_description, inv_miles, inv_price, inv_color, inv_image, inv_thumbnail, classification_id } = req.body
   let errors = []
   errors = validationResult(req)
   if (!errors.isEmpty()) {
     let nav = await utilities.getNav()
     let classificationSelect = await utilities.buildClassificationList(classification_id)
     res.render("inventory/add-inventory", {
       errors,
       title: "Add New Vehicle",
       nav,
       classification_id,
       classificationSelect,
       inv_make, inv_model, inv_year, inv_description, inv_miles, inv_price, inv_color, inv_image, inv_thumbnail
     })
     return
   }
   next()
}


 /* ******************************
  * Check data and return errors or continue to update the inventory
  * ***************************** */
 validate.checkUpdateData = async (req, res, next) => {
   
   const { inv_make, inv_model, inv_year, inv_description, inv_miles, inv_price, inv_color, inv_image, inv_thumbnail, classification_id, inv_id } = req.body
   let errors = []
   errors = validationResult(req)
   if (!errors.isEmpty()) {
     let nav = await utilities.getNav()
     let classificationSelect = await utilities.buildClassificationList(classification_id)
     res.render("inventory/edit-inventory", {
       errors,
       title: `Edit ${inv_make} ${inv_model}`,
       nav,
       classification_id,
       classificationSelect,
       inv_make, inv_model, inv_year, inv_description, inv_miles, inv_price, inv_color, inv_image, inv_thumbnail,
       inv_id
     })
     return
   }
   next()
}

module.exports = validate