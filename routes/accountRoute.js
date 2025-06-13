// Needed Resources 
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')
const bodyParser = require("body-parser")

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

// Deliver the Account Management View.

router.get("/", utilities.handleErrors(accountController.buildAccountManagement))

// Deliver the Account and Password Update View.

router.get("/update", utilities.handleErrors(accountController.buildAccountUpdate))

// Process the Account Update.

router.post("/update1", 
  regValidate.updateAccountRules(), regValidate.checkUpdateAccountData,  utilities.handleErrors(accountController.accountUpdateAccount))

// Process the Password Update.

router.post("/update2", regValidate.updatePasswordRules(), utilities.handleErrors(accountController.accountUpdatePassword))


// Logout process

router.get("/logout", utilities.handleErrors(accountController.logout))

// Deliver the add-employee view

router.get("/add-employee", utilities.handleErrors(accountController.buildAddEmployee))

// Process add a new employee.

router.post("/add-employee", regValidate.addEmployeeRules(), regValidate.checkAddEmployeeData, utilities.handleErrors(accountController.processAddEmployee))

module.exports = router;