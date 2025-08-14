// Fetch and populate About Me section
async function fetchAboutMe() {
    try {
        // Fetch the about me data from JSON file
        const response = await fetch('../data/about-me.json');
        // Parse the JSON response into a JavaScript object
        const data = await response.json();

        const aboutMeDiv = document.querySelector('#aboutMe');

        // Create paragraph element with bio text
        const paragraph = document.createElement('p');
        paragraph.textContent = data.about_me;
    }
}
