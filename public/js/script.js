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
