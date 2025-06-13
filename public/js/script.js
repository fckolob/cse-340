const passwordButton = document.querySelector("#passwordButton");
passwordButton.addEventListener("click", function(){
    const passwordInput = document.getElementById("account_password");
    const type = passwordInput.getAttribute("type");
    if (type == "password"){
        passwordInput.setAttribute("type", "text");
        passwordButton.innerHTML = "Hide Password";
    }
    else{
        passwordInput.setAttribute("type", "password");
        passwordButton.innerHTML = "Show Password";
    }
});

const passwordAdminButton = document.querySelector("#passwordAdminButton");

if(passwordAdminButton !== null){
passwordAdminButton.addEventListener("click", function(){
    const passwordAdminInput = document.getElementById("admin_account_password");
    const type = passwordAdminInput.getAttribute("type");
    if (type == "password"){
        passwordAdminInput.setAttribute("type", "text");
        passwordAdminButton.innerHTML = "Hide Password";
    }
    else{
        passwordAdminInput.setAttribute("type", "password");
        passwordAdminButton.innerHTML = "Show Password";
    }
});}