// Fetch and populate About Me section
async function fetchAboutMe() {
  try {
    // Fetch the about me data from JSON file
    const response = await fetch('../data/aboutMeData.json');
    console.log('Response status:', response.status);
    
    // Parse the JSON response into a JavaScript object
    const data = await response.json();
    console.log('Data loaded:', data);

    const aboutMeDiv = document.querySelector('#aboutMe');
    console.log('About me div found:', aboutMeDiv);

    // Create paragraph element with bio text
    const paragraph = document.createElement('p');
    paragraph.textContent = data.aboutMe;
    console.log('Paragraph created with text:', data.aboutMe);

    // Create headshot container div
    const headshotContainer = document.createElement('div');
    headshotContainer.className = 'headshotContainer';

    // Create image element
    const image = document.createElement('img');
    image.src = data.headshot;
    image.alt = 'Profile headshot';
    console.log('Image src set to:', data.headshot);

    // Append image to container
    headshotContainer.appendChild(image);

    // Append both elements to aboutMe div
    aboutMeDiv.appendChild(paragraph);
    aboutMeDiv.appendChild(headshotContainer);
    
    console.log('Elements appended successfully');
  } catch (error) {
    console.error('Error loading about me data:', error);
  }
}

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM loaded, calling fetchAboutMe');
  fetchAboutMe();
});
