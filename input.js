const form = document.getElementById("clientForm");
const output = document.getElementById("output");
const clearBtn = document.getElementById("clearBtn");

/* ------- FIELD ELEMENTS ------- */
const nameField = document.getElementById("fullName");
const emailField = document.getElementById("email");
const contactField = document.getElementById("contact");
const skillsField = document.getElementById("skills");
const descField = document.getElementById("description");

/* ------- ERROR ELEMENTS ------- */
const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const contactError = document.getElementById("contactError");
const skillsError = document.getElementById("skillsError");
const descError = document.getElementById("descError");

/* ------- VALIDATION FUNCTIONS ------- */
function validateName() {
    if (nameField.value.trim().length < 3) {
        nameError.textContent = "Full name must be at least 3 characters";
        return false;
    }
    nameError.textContent = "";
    return true;
}

function validateEmail() {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,4}$/;
    if (!pattern.test(emailField.value)) {
        emailError.textContent = "Enter a valid email address";
        return false;
    }
    emailError.textContent = "";
    return true;
}

function validateContact() {
    const pattern = /^[6-9][0-9]{9}$/;
    if (!pattern.test(contactField.value)) {
        contactError.textContent = "Enter a valid 10-digit mobile number";
        return false;
    }
    contactError.textContent = "";
    return true;
}

function validateSkills() {
    if ([...skillsField.selectedOptions].length === 0) {
        skillsError.textContent = "Please select at least one skill";
        return false;
    }
    skillsError.textContent = "";
    return true;
}

function validateDesc() {
    if (descField.value.trim().length < 10) {
        descError.textContent = "Description must be at least 10 characters";
        return false;
    }
    descError.textContent = "";
    return true;
}

/* ------- REAL-TIME VALIDATION ------- */
nameField.addEventListener("input", validateName);
emailField.addEventListener("input", validateEmail);
contactField.addEventListener("input", validateContact);
skillsField.addEventListener("change", validateSkills);
descField.addEventListener("input", validateDesc);

/* ------- FORM SUBMIT ------- */
form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (
        validateName() &&
        validateEmail() &&
        validateContact() &&
        validateSkills() &&
        validateDesc()
    ) {
        const selectedSkills = [...skillsField.selectedOptions].map(opt => opt.value).join(", ");

        output.innerHTML = `
            <h3>Submitted Data</h3>
            <p><strong>Name:</strong> ${nameField.value}</p>
            <p><strong>Email:</strong> ${emailField.value}</p>
            <p><strong>Contact:</strong> ${contactField.value}</p>
            <p><strong>Skills:</strong> ${selectedSkills}</p>
            <p><strong>Description:</strong> ${descField.value}</p>
        `;
        output.classList.remove("hidden");
    }
});

/* ------- CLEAR BUTTON ------- */
clearBtn.addEventListener("click", () => {
    form.reset();
    output.classList.add("hidden");

    nameError.textContent = "";
    emailError.textContent = "";
    contactError.textContent = "";
    skillsError.textContent = "";
    descError.textContent = "";
});
