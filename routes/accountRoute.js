// Needed Resources 
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

// Route to build the login view

router.get("/login", utilities.handleErrors(accountController.buildLogin))

//Route to build the register view

router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Process the registration data

router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Process the login attempt
router.post(
  "/login",
   regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

router.get("/", utilities.handleErrors(accountController.buildAccountManagement))

module.exports = router;