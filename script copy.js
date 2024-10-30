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
    document.getElementById("less").value = "";
    document.getElementById("template").textContent = ""; // Clear generated template
    brands = []; // Clear brands array
    displayBrands(); // Refresh brand list
    document.getElementById("brand-input-group").style.display = "none"; // Hide brand input group
}

function generateTemplate() {
    // Get user inputs
    let name = document.getElementById("name").value;
    const pp = document.getElementById("pp").value;
    const less = document.getElementById("less").value.split(" ");
    
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
    if (less.length === 0 || less[0] === "") {
        alert("Please enter the review/rating.");
        return;
    }

    // Function to get a random emoji
    function getRandomEmoji() {
        const emojis = ["😀", "😂", "😍", "😎", "🥳", "🤔", "🙌", "🎉", "👍", "✨"];
        return emojis[Math.floor(Math.random() * emojis.length)];
    }

    // Create the template based on the number of 'less' inputs
    if (less.length === 1) {
        res = "*Amazon Review Deal*\n\n*" + name + "*\n\n*PP: " + pp + "*\n\n*`Less: " + less[0] + " " + getRandomEmoji() + "`*\n\nDM for Link " + "🔗";
    } else if (less.length === 2) {
        res = "*Amazon Review/Rating Deal*\n\n*" + name + "*\n\n*PP: " + pp + "*\n\n*`Review: " + less[0] + " " + getRandomEmoji() + "`*\n*`Rating: " + less[1] + " " + getRandomEmoji() + "`*\n\nDM for Link " + "🔗";
    }

    // Display the result in the 'template' element
    document.getElementById("template").textContent = res;

    // Copy the result to the clipboard
    const tempInput = document.createElement("textarea");
    document.body.appendChild(tempInput);
    tempInput.value = res;
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);

    alert("Template copied to clipboard!");
}

const API_BASE_URL = "https://templategeneratorbackend-9qqx6aepl.vercel.app";

async function getBrandsFromAPI() {
    try {
        const response = await fetch(`${API_BASE_URL}/brands`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const brands = await response.json();
        console.log(brands);
    } catch (error) {
        console.error('Error fetching brands:', error);
    }
}

// Call the function
getBrandsFromAPI();

// Call displayBrands on page load to show stored brands
displayBrands();
