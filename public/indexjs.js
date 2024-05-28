const express = require('express');
const app = express();

// Serve static files from the 'public' folder
app.use(express.static('public'));

// Your other routes and middleware configurations go here

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});


// Function to fetch data from the database based on blood group
document.addEventListener('DOMContentLoaded', function () {
    async function fetchDataFromDatabase(selectedBloodGroup, searchKeyword) {
        try {
            const response = await fetch(`/bloodbank?bloodgroup=${selectedBloodGroup}`);

            if (!response.ok) {
                throw new Error('Failed to fetch data from the database');
            }

            const data = await response.json();
            console.log(data);
            console.log(searchKeyword);
            displayResults(data, searchKeyword);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    // Function to handle the search button click
    function handleSearchButtonClick() {
        var selectedBloodGroup = document.getElementById('bloodGroupFilter').value;
        var searchKeyword = document.getElementById('searchBar').value.toLowerCase();
        // Call the function to fetch data from the database
        fetchDataFromDatabase(selectedBloodGroup, searchKeyword);
    }

    // Function to display results in the UI
    function displayResults(data, searchKeyword) {
        var resultsContainer = document.getElementById('bloodBankResults');
        resultsContainer.innerHTML = '';

        data.forEach(entry => {
            // Check if the entry name or details contain the search keyword
            if (entry.name.toLowerCase().includes(searchKeyword) ||
                entry.email.toLowerCase().includes(searchKeyword) ||
                entry.phone.includes(searchKeyword)) {

                var entryDiv = document.createElement('div');
                entryDiv.classList.add('bloodBankEntry', 'grid-item');
                entryDiv.setAttribute('data-blood-group', entry.bloodGroup);

                // Customize this part based on your actual database schema
                entryDiv.innerHTML = `
    <p>Name: ${entry.firstname}</p>
    <p>Age: ${entry.age}</p>
    <p>Email: ${entry.email}</p>
    <p>Phone: ${entry.phonenumber}</p>
    `;

                resultsContainer.appendChild(entryDiv);
            }
        });
    }

    // Attach the handleSearchButtonClick function to the search button click event
    document.getElementById('searchButton').addEventListener('click', handleSearchButtonClick);

    // Initial load to display all blood bank entries
    fetchDataFromDatabase('ALL', '');
});
