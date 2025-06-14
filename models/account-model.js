// Needed resources

const pool = require("../database")

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
  try {
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
  } catch (error) {
    return error.message
  }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}


/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}


/* *****************************
* Return account data using account id
* ***************************** */
async function getAccountById(account_id) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type FROM account WHERE account_id = $1',
      [account_id])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching account_id found")
  }
}

/* ***************************
 *  Update Account Data
 * ************************** */
async function updateAccountAccount(
  account_firstname, account_lastname, account_email, account_id
) {
  try {
    const sql =
      "UPDATE public.account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *"
    const data = await pool.query(sql, [
      account_firstname, account_lastname, account_email, account_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}


/* ***************************
 *  Update Account Password
 * ************************** */
async function updateAccountPassword(account_id, account_password
) {
  try {
    const sql =
      "UPDATE public.account SET account_password = $2 WHERE account_id = $1 RETURNING *"
    const data = await pool.query(sql, [
      account_id, account_password
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

/* *****************************
*   Register new account
* *************************** */
async function addEmployee(account_firstname, account_lastname, account_email, account_password, account_type){
  try {
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, $5) RETURNING *"
    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password, account_type])
  } catch (error) {
    return error.message
  }
}


/* *****************************
* Return account data by account type.
* ***************************** */
async function getAccountDataByAccountType(account_type) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email FROM account WHERE account_type = $1',
      [account_type])
    return result.rows || []
  } catch (error) {
    console.error(error)
    return []
  }
}


/* *****************************
* Remove account by Id.
* ***************************** */

async function removeAccountbyId(
  account_id
) {
  try {
    const sql =
      'DELETE FROM account WHERE account_id = $1'
    const data = await pool.query(sql, [
      account_id
    ])
    return data
  } catch (error) {
    console.error("delete account error: " + error)
  }
}


module.exports = {registerAccount, checkExistingEmail, getAccountByEmail, getAccountById, updateAccountAccount, updateAccountPassword, addEmployee, getAccountDataByAccountType, removeAccountbyId}