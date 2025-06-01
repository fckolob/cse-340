const utilities = require(".")
const { body, validationResult } = require("express-validator")
const accountModel = require("../models/inventory-model")
const validate = {}

 validate.registationRules = () => {
    return [ body("inv_make")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .isAlpha()
        .withMessage("Please provide a valid classification name."),

        body("inv_model")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .isAlpha()
        .withMessage("Please provide a valid classification name."),

        

        body("inv_year")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .isAlpha()
        .withMessage("Please provide a valid classification name."),

        body("inv_description")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .isAlpha()
        .withMessage("Please provide a valid classification name."),

        body("inv_image")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .isAlpha()
        .withMessage("Please provide a valid classification name."),

        body("inv_thumbnail")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .isAlpha()
        .withMessage("Please provide a valid classification name."),

        body("inv_price")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .isAlpha()
        .withMessage("Please provide a valid classification name."),

        body("inv_miles")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .isAlpha()
        .withMessage("Please provide a valid classification name."),

        body("inv_color")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .isAlpha()
        .withMessage("Please provide a valid classification name."),
    ]

        
 }

  /* ******************************
  * Check data and return errors or continue to registration
  * ***************************** */
 validate.checkInventoryData = async (req, res, next) => {
   const { inv_make, inv_model, inv_year, inv_description, inv_miles, inv_price, inv_color, inv_image, inv_thumbnail} = req.body
   let errors = []
   errors = validationResult(req)
   if (!errors.isEmpty()) {
     let nav = await utilities.getNav()
     res.render("inventory/add-inventory", {
       errors,
       title: "Add New Vehicle",
       nav,
       inv_make, inv_model, inv_year, inv_description, inv_miles, inv_price, inv_color, inv_image, inv_thumbnail
     })
     return
   }
   next()
}

module.exports = validate