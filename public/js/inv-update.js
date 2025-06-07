const form = document.querySelector("#edit-inventory-form")
    form.addEventListener("change", function () {
      const updateBtn = document.querySelector("#update-inventory")
      updateBtn.removeAttribute("disabled")
    })