const formSubmit = document.querySelector(".formSubmit");
const formInputAll = document.querySelectorAll(".formSubmit input, .formSubmit textarea");
const btnSubmit = document.querySelector(".button");

if (formSubmit && btnSubmit) {
    // Set flag so that it alerts only once time
    let flag = true;

    btnSubmit.addEventListener("click", (e) => {
        e.preventDefault();
        // Setting back to true so that next time it will check again
        flag = true;

        formInputAll.forEach((item) => {
            formSubmitCheck(item);
        });

        // Submitting form after all checks pass
        if (flag) {
            formSubmit.submit();
        }
    });
} else {
    console.error("Form or button not found");
}

function formSubmitCheck(item) {
    if (flag === true) {
        if (item.value.trim() === "") {
            alert("Please provide correct Input");
            flag = false;
        }
    }
}