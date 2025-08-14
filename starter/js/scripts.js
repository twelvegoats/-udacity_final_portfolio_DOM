// Fetch and populate About Me section
async function fetchAboutMe() {
  try {
    // Fetch the about me data from JSON file
    const response = await fetch('./data/aboutMeData.json');
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
    // Fix the path from JSON file
    image.src = data.headshot.replace('../', './');
    image.alt = 'Profile headshot';

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

// Fetch and populate Projects section
async function fetchProjects() {
  try {
    // Fetch the projects data from JSON file
    const response = await fetch('./data/projectsData.json');
    console.log('Projects response status:', response.status);

    // Parse the JSON response into a JavaScript object
    const data = await response.json();
    console.log('Projects data loaded:', data);

    // Create project cards
    createProjectCards(data);

    // Initialize spotlight with first project
    if (data.length > 0) {
      updateSpotlight(data[0]);
    }

    // Set up navigation arrows
    setupNavigationArrows();
  } catch (error) {
    console.error('Error loading projects data:', error);
  }
}

// Create project cards
function createProjectCards(projects) {}

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM loaded, calling fetchAboutMe');
  fetchAboutMe();

  // Update header name
  const headerTitle = document.querySelector('header h1');
  headerTitle.textContent = 'Sean Wildman';
});
