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

    // Create headshot container div
    const headshotContainer = document.createElement('div');
    headshotContainer.className = 'headshotContainer';

    // Create image element
    const image = document.createElement('img');
    image.src = data.headshot;
    image.alt = 'Profile headshot';

    // Append image to container
    headshotContainer.appendChild(image);

    // Append both elements to aboutMe div
    aboutMeDiv.appendChild(paragraph);
    aboutMeDiv.appendChild(headshotContainer);
  } catch (error) {
    console.error('Error loading about me data:', error);
  }
}
