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
  
  
  if(req.cookies && req.cookies.jwt){
    const jwtPayload = res.locals.jwtPayload
    const firstName = jwtPayload.account_firstname
    let greeting
    let inventoryManagementLink
  if(admin){
    greeting = `<h2 class="greeting">Welcome Happy ${firstName}</h2>`
    inventoryManagementLink = `<h3>Inventory Management</h3>
  <p><a href="/inv/">Access</a></p>`

  res.render("account/management", {
    title: "Account Management",
    nav,
    greeting,
    inventoryManagementLink,
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




module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildAccountManagement, buildAccountUpdate,accountUpdateAccount, accountUpdatePassword}