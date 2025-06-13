// Needed resources
const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null
  })
}


/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null
  })
  
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

// Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }



  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null
    })
  }
}


/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/* ****************************************
 *  Build the account management view
 * ************************************ */
async function buildAccountManagement(req, res, next) {
  let nav = await utilities.getNav()
  const admin = res.locals.admin
  const adminAdmin = res.locals.adminAdmin
  let addEmployeeLink = ""
  
  if(req.cookies && req.cookies.jwt){
    const jwtPayload = res.locals.jwtPayload
    const firstName = jwtPayload.account_firstname
    let greeting
    let inventoryManagementLink
  if(admin){
    greeting = `<h2 class="greeting">Welcome Happy ${firstName}</h2>`
    inventoryManagementLink = `<h3 id="inventory-management-link-h3">Inventory Management</h3>
  <p id="inventory-management-link-p"><a id="inventory-management-link-a" href="/inv/">Access</a></p>`
  if(adminAdmin){
    addEmployeeLink = `<a id="addEmployeeLink" href="/account/add-employee">Add a New Employee</a>`}
  res.render("account/management", {
    title: "Account Management",
    nav,
    greeting,
    inventoryManagementLink,
    addEmployeeLink,
    errors: null
    })
  }
  else{
    greeting = `<h2 class="greeting">Welcome ${firstName}</h2>`
    inventoryManagementLink = ""

    res.render("account/management", {
    title: "Account Management",
    nav,
    greeting,
    inventoryManagementLink,
    addEmployeeLink,
    errors: null
  })

  }}
  
 
}


/* ****************************************
 *  Build the account update view
 * ************************************ */
async function buildAccountUpdate(req, res, next) {
  let nav = await utilities.getNav()
  if(req.cookies && req.cookies.jwt){
    const jwtPayload = res.locals.jwtPayload
    const account_id = parseInt(jwtPayload.account_id)
    const accountData = await accountModel.getAccountById(account_id)
   res.render("account/update", {
    title: "Account Update",
    nav,
    errors: null,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
    account_id: account_id
    })}
}


/* ***************************
 *  Update Account Data
 * ************************** */
async function accountUpdateAccount(req, res, next) {
  let nav = await utilities.getNav()
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_id
  } = req.body
  const updateResult = await accountModel.updateAccountAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_id
  )

  if (updateResult) {
    const firstName = updateResult.account_firstname
    req.flash("notice", `${firstName}, your account was successfully updated.`)
    res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the account update failed.")
    res.status(501).render("account/update", {
    title: "Update Account",
    nav,
    errors: null,
    account_firstname: account_firstname,
    account_lastname: account_lastname,
    account_email: account_email,
    account_id: account_id
    })
  }
}

/* ***************************
 *  Update Account Password
 * ************************** */

async function accountUpdatePassword(req, res, next) {
  let nav = await utilities.getNav()
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_id, 
    account_password
  } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the account update.')
    res.status(500).render("account/update", {
      title: "Update Account",
      nav,
      account_firstname: account_firstname,
      account_lastname: account_lastname,
      account_email: account_email,
      account_id: account_id,
      errors: null,
    })
  }


  const updateResult = await accountModel.updateAccountPassword(
  account_id, hashedPassword
  )

  if (updateResult) {
    const firstNamex = updateResult.account_firstname
    req.flash("notice", `${firstNamex}, your password was successfully updated.`)
    res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the password update failed.")
    res.status(501).render("account/update", {
    title: "Update Account",
    nav,
    errors: null,
    account_firstname: account_firstname,
    account_lastname: account_lastname,
    account_email: account_email,
    account_id: account_id
    })
  }
}


// Logout process

async function logout(req, res, next) {
   if(req.cookies && req.cookies.jwt){
    res.clearCookie("jwt")
    req.flash("notice", "You are logged out")
    res.redirect("/")
   }
   
   res.redirect("/")
}

// Build add-employee view

async function buildAddEmployee(req, res, next) {
  let nav = await utilities.getNav()
  let adminAdmin = res.locals.adminAdmin
  if(adminAdmin){
  res.render("account/add-employee", {
    title: "Add a New Employee",
    nav,
    errors: null
  })}
  else{
    res.flash("notice", "Access denied")
    res.redirect("/")
  }
}



/* ****************************************
*  Process add a new employee.
* *************************************** */
async function processAddEmployee(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password, admin_account_password } = req.body
  let jwtPayload = res.locals.jwtPayload
  let adminEmail = jwtPayload.account_email
  let account_type = "Employee"
  const accountData = await accountModel.getAccountByEmail(adminEmail)
  if (!accountData) {
    req.flash("notice", "Something Failed, please try again")
    res.status(400).render("account/add-employee", {
      title: "Add a New Employee",
      nav,
      account_firstname: account_firstname,
      account_lastname: account_lastname,
      account_email: account_email,
      errors: null,
      account_email,
    })
    return
  }

    if (await bcrypt.compare(admin_account_password, accountData.account_password)) {
      
      


// Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the employee addition.')
    res.status(500).render("account/add-employee", {
      title: "Add a New Employee",
      nav,
      account_firstname: account_firstname,
      account_lastname: account_lastname,
      account_email: account_email,
      errors: null,
    })
  }



  const regResult = await accountModel.addEmployee(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword,
    account_type
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, your employee ${account_firstname} ${account_lastname} was added.`
    )
    res.status(201).redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the employee addition failed.")
    res.status(501).render("account/add-employee",
    {
      title: "Add a New Employee",
      nav,
      account_firstname: account_firstname,
      account_lastname: account_lastname, 
      account_email: account_email,
      errors: null
    })
  }
}
else{
  req.flash("notice", "The Admin Password is Wrong, check and try again")
  res.render("account/add-employee", {
    title: "Add a New Employee",
      nav,
      account_firstname: account_firstname,
      account_lastname: account_lastname, 
      account_email: account_email,
      errors: null
  })
}}


module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildAccountManagement, buildAccountUpdate,accountUpdateAccount, accountUpdatePassword, logout, buildAddEmployee, processAddEmployee}