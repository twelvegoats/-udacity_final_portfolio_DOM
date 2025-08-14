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
    const projectList = document.querySelector('#projectList');

    // Set up navigation arrows
    setupNavigationArrows();
  } catch (error) {
    console.error('Error loading projects data:', error);
  }
}

// Create project cards
function createProjectCards(projects) {
  const projectList = document.querySelector('#projectList');

  projects.forEach((project) => {
    // Create project card div
    const projectCard = document.createElement('div');
    projectCard.className = 'projectCard';
    projectCard.id = project.project_id;

    // Set background image with fallback
    const cardImage = project.card_image
      ? project.card_image.replace('../', './')
      : './images/card_placeholder_bg.webp';
    projectCard.style.backgroundImage = `url(${cardImage})`;
    projectCard.style.backgroundSize = 'cover';
    projectCard.style.backgroundPosition = 'center';

    // Create title element
    const title = document.createElement('h4');
    title.textContent = project.project_name || 'Untitled Project';

    // Create description element
    const description = document.createElement('p');
    description.textContent =
      project.short_description || 'No description available';

    // Append elements to card
    projectCard.append(title, description);

    // Add click listener to update spotlight
    projectCard.addEventListener('pointerdown', () => {
      updateSpotlight(project);
    });

    // Append card to project list
    projectList.append(projectCard);
  });
}

// Setup navigation arrows
function setupNavigationArrows() {
  // Target needed elements
  const leftArrow = document.querySelector('.arrow-left');
  const rightArrow = document.querySelector('.arrow-right');
  const projectList = document.querySelector('#projectList');

  // Check if page is desktop or mobile
  const isDesktop = () => window.matchMedia('(min-width: 1024px)').matches;

  // Left arrow scroll behavior
  leftArrow.addEventListener('pointerdown', () => {
    if (isDesktop()) {
      // Scroll up on desktop
      projectList.scrollBy({
        top: -220, // Card height + margin
        behavior: 'smooth',
      });
    } else {
      // Scroll left on mobile
      projectList.scrollBy({
        left: -220, // Card width + margin
        behavior: 'smooth',
      });
    }
  });

  // Right arrow scroll behavior
  rightArrow.addEventListener('pointerdown', () => {
    if (isDesktop()) {
      // Scroll down on desktop
      projectList.scrollBy({
        top: 220, // Card height + margin
        behavior: 'smooth',
      });
    } else {
      // Scroll right on mobile
      projectList.scrollBy({
        left: 220, // Card width + margin
        behavior: 'smooth',
      });
    }
  });
}

// Update spotlight section
function updateSpotlight(project) {
  // Target spotlight elements
  const spotlight = document.querySelector('#projectSpotlight');
  const spotlightTitles = document.querySelector('#spotlightTitles');

  // Set background image with fallback
  const spotlightImage = project.spotlight_image
    ? project.spotlight_image.replace('../', './')
    : './images/spotlight_placeholder_bg.webp';
  spotlight.style.backgroundImage = `url(${spotlightImage})`;
  spotlight.style.backgroundSize = 'cover';
  spotlight.style.backgroundPosition = 'center';

  // Clear existing content
  spotlightTitles.replaceChildren();

  // Create title
  const title = document.createElement('h3');
  title.textContent = project.project_name || 'Untitled Project';

  // Create description
  const description = document.createElement('p');
  description.textContent =
    project.long_description || 'No detailed description available';

  // Create link
  const link = document.createElement('a');
  link.href = project.url || '#';
  link.textContent = 'Click here to see more...';
  link.target = '_blank';

  // Append elements to spotlight titles using append
  spotlightTitles.append(title, description, link);
}

// Form validation functionality
function setupFormValidation() {
  // Add variables to target elements
  const form = document.querySelector('#formSection');
  const emailInput = document.querySelector('#contactEmail');
  const messageTextarea = document.querySelector('#contactMessage');
  const emailError = document.querySelector('#emailError');
  const messageError = document.querySelector('#messageError');
  const charactersLeft = document.querySelector('#charactersLeft');

  // Regular expressions for validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const illegalCharsRegex = /[^a-zA-Z0-9@._-]/;

  // Update character count
  messageTextarea.addEventListener('input', function () {
    const currentLength = this.value.length;
    charactersLeft.textContent = `Characters: ${currentLength}/300`;

    // Clear message error when user starts typing (if it was a length error)
    if (currentLength <= 300) {
      messageError.textContent = '';
    }
  });
}

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM loaded, calling fetchAboutMe');
  fetchAboutMe();
  fetchProjects();

  // Update header name
  const headerTitle = document.querySelector('header h1');
  headerTitle.textContent = 'Sean Wildman';
});
