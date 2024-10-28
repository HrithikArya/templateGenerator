let brands = []; // Array to store brand names

// Load stored brands from the server on page load
fetch('http://localhost:3000/api/brands')
    .then(response => response.json())
    .then(data => {
        brands = data;
        displayBrands();
    })
    .catch(error => console.error('Error loading brands:', error));

function toggleBrandInput() {
    const brandInputGroup = document.getElementById("brand-input-group");
    brandInputGroup.style.display = brandInputGroup.style.display === "none" ? "flex" : "none"; // Toggle display
}

function addBrand() {
    const brandInput = document.getElementById("brand");
    const brandName = brandInput.value.trim();
    
    // Check if brand name is not empty and not already in the list
    if (brandName && !brands.includes(brandName)) {
        brands.push(brandName);
        saveBrands(); // Save updated brands to the server
        displayBrands();
        brandInput.value = ""; // Clear the input field
        toggleBrandInput(); // Hide the input group
    } else if (brands.includes(brandName)) {
        alert("Brand name already exists.");
    } else {
        alert("Please enter a valid brand name.");
    }
}

function closeBrandInput() {
    const brandInput = document.getElementById("brand");
    brandInput.value = ""; // Clear the input field
    toggleBrandInput(); // Hide the input group
}

function saveBrands() {
    fetch('http://localhost:3000/api/brands', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ brands }),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
    })
    .catch(error => console.error('Error saving brands:', error));
}

function displayBrands() {
    const brandList = document.getElementById("brand-list");
    brandList.innerHTML = ""; // Clear existing list
    brands.forEach(brand => {
        const li = document.createElement("li");
        li.textContent = brand;
        brandList.appendChild(li);
    });
}

function clearForm() {
    document.getElementById("brand").value = "";
    document.getElementById("name").value = "";
    document.getElementById("pp").value = "";
    document.getElementById("template").textContent = ""; // Clear generated template
    brands = []; // Clear brands array
    displayBrands(); // Refresh brand list
    document.getElementById("brand-input-group").style.display = "none"; // Hide brand input group
}

// Toggle visibility of input boxes based on checkbox selection
function toggleInput(inputId) {
    const inputDiv = document.getElementById(inputId);
    const checkbox = document.getElementById(inputId.split('-')[0]);
    
    if (checkbox.checked) {
        inputDiv.style.display = 'block';
    } else {
        inputDiv.style.display = 'none';
    }

    // Ensure at least one checkbox is selected
    const checkboxes = document.querySelectorAll('input[name="options"]');
    const isChecked = Array.from(checkboxes).some(cb => cb.checked);
    if (!isChecked) {
        checkbox.checked = true;
        inputDiv.style.display = 'block'; // Show at least one input
        alert('At least one option must be selected.');
    }
}

function checkForFull(less) {
    // Convert the input to a number if it's a string
    if (typeof less === 'string') {
        less = less.trim(); // Remove whitespace
        if (!isNaN(less) && less !== '') {
            less = Number(less); // Convert to number if it's a numeric string
        }
    }

    // Check if less is an integer or a number
    if (typeof less === 'number') {
        if (less === 0) {
            return 'Full Refund'; // Case for zero
        } else if (less < 0) {
            return `Full + ${Math.abs(less)} Commission`; // Case for negative
        } else if (less > 0) {
            return `${Math.abs(less)} Less`; // Case for positive
        }
    } else if (typeof less === 'string') {
        // If it's a string, check for specific values
        const lowerCaseLess = less.toLowerCase(); // Normalize the string to lower case
        if (lowerCaseLess === 'full' || lowerCaseLess === 'full refund') {
            return 'Full Refund'; // Case for "full" or "full refund"
        }
    }

    // Default return value if none of the conditions are met
    return 'Invalid Input';
}

function generateTemplate() {
    // Get user inputs
    let name = document.getElementById("name").value;
    const pp = document.getElementById("pp").value;
    //const selectedOptions = [];
    const checkboxes = document.querySelectorAll('input[name="options"]:checked');

    const selectedOptions = [];
    if (document.getElementById("review").checked) {
        const reviewLess = document.getElementById("review-less").value.trim();
        selectedOptions.push(`Review: ${checkForFull(reviewLess)}`);
    }
    if (document.getElementById("rating").checked) {
        const ratingLess = document.getElementById("rating-less").value.trim();
        selectedOptions.push(`Rating: ${checkForFull(ratingLess)}`);
    }
    if (document.getElementById("submitted").checked) {
        const submittedLess = document.getElementById("submitted-less").value.trim();
        selectedOptions.push(`Review Submitted: ${checkForFull(submittedLess)}`);
    }
    if (document.getElementById("order").checked) {
        const orderLess = document.getElementById("order-less").value.trim();
        selectedOptions.push(`Only Order: ${checkForFull(orderLess)}`);
    }

    // Check if at least one option is selected
    //if (selectedOptions.length === 0) {
    //    alert("Please select at least one option.");
    //    return;
    //}

    // Remove any stored brand names from the product name
    brands.forEach(brand => {
        const regex = new RegExp("\\b" + brand + "\\b", "gi"); // Match whole words, case insensitive
        name = name.replace(regex, "").trim(); // Remove brand names and trim spaces
    });
    
    // Initialize the result string
    let res = "";

    // Validate inputs
    if (name === "") {
        alert("Please enter the product name.");
        return;
    }
    if (pp === "") {
        alert("Please enter the product price (PP).");
        return;
    }
    if (selectedOptions.length === 0) {
        alert("Please select at least one option.");
        return;
    }

    // Function to get a random emoji
    function getRandomEmoji() {
        const emojis = ["😀", "😂", "😍", "😎", "🥳", "🤔", "🙌", "🎉", "👍", "✨"];
        return emojis[Math.floor(Math.random() * emojis.length)];
    }

    // Get the selected platform
    const selectedPlatform = document.querySelector('input[name="platform"]:checked').value;
    const selectedOptionsForDealType = [];
    const checkboxesForDealType = document.querySelectorAll('input[name="options"]:checked');
    checkboxesForDealType.forEach(checkbox => {
        selectedOptionsForDealType.push(checkbox.value);
    });
   // Create the template based on the selected options
    //res =  `*${selectedPlatform} Review Deal*\n\n*${name}*\n\nPP: ${pp}\n\n`;

        // Dynamically generate the deal type based on selected options
    let dealType = `${selectedPlatform} `;
    if (selectedOptionsForDealType.includes("Review") && selectedOptionsForDealType.includes("Rating")) {
        dealType += "Review/Rating Deal";
    } else if (selectedOptionsForDealType.includes("Review")) {
        dealType += "Review Deal";
    } else if (selectedOptionsForDealType.includes("Rating")) {
        dealType += "Rating Deal";
    } else if (selectedOptionsForDealType.includes("Review Submitted")) {
        dealType += "Review Submitted Deal";
    } else if (selectedOptionsForDealType.includes("Only Order")) {
        dealType += "Only Order Deal";
    }

    // Add platform and deal type to the template
    res += `*${dealType}*\n\n*${name}*\n\n*PP: ${pp}*\n\n`;


    selectedOptions.forEach(option => {
        res += `*\`${option}\`* ${getRandomEmoji()}\n`; // Add random emoji for each selected option
    });

    
 

    

    res += "\nDM for Link 🔗"
    // Display the result in the 'template' element
    document.getElementById("template").textContent = res;

    // Copy the result to the clipboard
    // const tempInput = document.createElement("textarea");
    // document.body.appendChild(tempInput);
    // tempInput.value = res;
    // tempInput.select();
    //document.execCommand("copy");
    //document.body.removeChild(tempInput);

    //alert("Template copied to clipboard!");
}

function clearForm() {
    document.getElementById("brand").value = "";
    document.getElementById("name").value = "";
    document.getElementById("pp").value = "";
    document.getElementById("review-less").value = "";
    document.getElementById("rating-less").value = "";
    document.getElementById("review-submitted-less").value = "";
    document.getElementById("order-only-less").value = "";
    
    // Hide less input fields
    document.getElementById("review-less-input").style.display = "block";
    document.getElementById("rating-less-input").style.display = "none";
    document.getElementById("submitted-less-input").style.display = "none";
    document.getElementById("order-only-less-input").style.display = "none";

    // Clear the generated template
    document.getElementById("template").textContent = "";
    
    // Reset brands array and refresh brand list
    brands = [];
    displayBrands();
    document.getElementById("brand-input-group").style.display = "none"; // Hide brand input group
}

function copyTemplate() {
    const templateText = document.getElementById("template").textContent;
    
    if (!templateText) {
        alert("There is no template to copy!");
        return;
    }

    const tempInput = document.createElement("textarea");
    document.body.appendChild(tempInput);
    tempInput.value = templateText;
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);

    //alert("Template copied to clipboard!");
        // Create a temporary message element
    const message = document.createElement("div");
    message.textContent = "Template copied to clipboard!";
    message.style.position = "fixed";
    message.style.top = "20px"; // Position it at the top of the page
    message.style.right = "20px"; // Position it to the right
    message.style.backgroundColor = "#4caf50"; // Green background
    message.style.color = "#fff"; // White text
    message.style.padding = "10px";
    message.style.borderRadius = "5px";
    message.style.zIndex = "1000"; // Ensure it's above other content
    document.body.appendChild(message);

    // Remove the message after 2-3 seconds
    setTimeout(() => {
        document.body.removeChild(message);
    }, 3000); // 3000 milliseconds = 3 seconds
}


// Call displayBrands on page load to show stored brands
displayBrands();