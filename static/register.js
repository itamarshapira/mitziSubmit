const firstNameIn = document.getElementById('firstName');
const lastNameIn = document.getElementById('lastName');
const emailIn = document.getElementById('email');
const passwordIn = document.getElementById('password');
const confirmPasswordIn = document.getElementById('confirmPassword');
const submitBtn = document.getElementById('submit');

submitBtn.addEventListener('click', async function(event) {
    event.preventDefault(); 
    // function(event): The event parameter is automatically provided by the browser and gives you information about the event.
    // event.preventDefault(): Prevents the default action associated with the event, allowing you to handle the event in a custom way.

    const firstNameText = firstNameIn.value.trim(); // Get the trimmed value of the input field
    const lastNameText = lastNameIn.value.trim();
    const emailText = emailIn.value.trim();
    const passwordText = passwordIn.value.trim();
    const confirmPasswordText = confirmPasswordIn.value.trim();

    if (!validateForm(firstNameText, lastNameText, emailText, passwordText, confirmPasswordText)) {
        // If validation fails, do not proceed
        return;
    }

    const emailExists = await ajax_get_email(emailText);
    if (emailExists) {
        alert('Email already exists. Please use a different email.');
        return;
    }

    ajax_add_register(firstNameText, lastNameText, emailText, passwordText); // Add the new register via AJAX
});

const validateForm = (firstName, lastName, email, password, confirmPassword) => {
    // Check if any field is empty
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        alert('All fields are required.');
        return false;
    }

    // Check if password is at least 8 characters long
    if (password.length < 8) {
        alert('Password must be at least 8 characters long.');
        return false;
    }

    // Check if password matches confirm password
    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return false;
    }

    // Check if the email is valid
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(email)) {
        alert('Invalid email.');
        return false;
    }

    // If all validations pass, return true
    return true;
}

const ajax_add_register = (name, lastName, email, password) => {
    fetch("http://localhost:3000/submit", { // Make a POST request to the server
        method: "POST",
        headers: {
            "Content-Type": "application/json", // Specify the content type as JSON
        },
        body: JSON.stringify({ // Send the registration details in the request body
            first_name: name,
            last_name: lastName,
            email: email,
            password: password
        })
    }).then((res) => {
        if (res.ok) {
            return res.json(); // If the response is OK, parse the JSON response
        } else {
            throw new Error("Error registering new user");
        }
    }).then((data) => {
        // Display a success message
        alert(data.message || "Registered successfully!");

        // Redirect to the home page
        window.location.href = "/";
    }).catch((err) => {
        console.error(err);
        alert("An error occurred while registering. Please try again.");
    });
}

const ajax_get_email = async (newEmail) => { // Function to fetch all tasks from the server via AJAX into browser 
    try {
        const res = await fetch("http://localhost:3000/submits", { // Make a GET request to the server
            method: "GET",
            headers: {
                "Content-Type": "application/json", // Specify the content type as JSON
            }
        });

        if (!res.ok) { // If the response is not OK, throw an error
            throw new Error("Error getting tasks");
        }

        const data = await res.json(); // Parse the JSON response

        return data.some((existUser) => existUser.email === newEmail);
    } catch (err) {
        console.error(err);
        return false;
    }
}
