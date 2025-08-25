// Fetch and populate About Me section
async function fetchAboutMe() {
  try {
    // Fetch the about me data from JSON file
    const response = await fetch('./data/aboutMeData.json');

    // Parse the JSON response into a JavaScript object
    const data = await response.json();

    const aboutMeDiv = document.querySelector('#aboutMe');

    // Use DocumentFragment to batch DOM insertions
    const fragment = document.createDocumentFragment();

    // Create paragraph element with bio text
    const paragraph = document.createElement('p');
    paragraph.textContent = data.aboutMe;

    // Create headshot container div
    const headshotContainer = document.createElement('div');
    headshotContainer.className = 'headshotContainer';

    // Create image element
    const image = document.createElement('img');
    // Fix the path from JSON file
    image.src = data.headshot.replace('../', './');
    image.alt = 'Profile headshot';

    // Build structure in fragment
    headshotContainer.append(image);
    fragment.append(paragraph, headshotContainer);
    aboutMeDiv.append(fragment);
  } catch (error) {
    console.error('Error loading about me data:', error);
  }
}

async function fetchProjects() {
  try {
    // Fetch the projects data from JSON file
    const response = await fetch('./data/projectsData.json');

    // Parse the JSON response into a JavaScript object
    const data = await response.json();

    // Validate that data is an array
    if (!Array.isArray(data)) {
      throw new Error('Projects data is not an array');
    }

    // Create project cards
    const createdCards = createProjectCards(data);

    // Initialize spotlight with first valid project using find()
    const firstProject = data.find(
      (project) => project && project.project_name
    );
    if (firstProject) {
      updateSpotlight(firstProject);

      // Set first card as active
      const firstCard = createdCards.find(
        (card) => card.id === firstProject.project_id
      );
      if (firstCard) {
        firstCard.classList.add('active');
      }
    }

    setupNavigationArrows();
  } catch (error) {
    console.error('Error loading projects data:', error);
  }
}

// Create project cards
function createProjectCards(projects) {
  const projectList = document.querySelector('#projectList');

  // Create fragment to batch all card insertions
  const fragment = document.createDocumentFragment();

  const projectCards = projects
    .filter((project) => project && project.project_name) // Filter out invalid projects
    .map((project, index) => {
      // Create project card div
      const projectCard = document.createElement('div');
      projectCard.className = 'projectCard';
      projectCard.id = project.project_id || `project-${index}`;

      // Set background image with fallback using ternary operator
      const cardImage = project.card_image
        ? project.card_image.replace('../', './')
        : './images/card_placeholder_bg.webp';

      // Batch all styles at once
      projectCard.style.cssText = `
        background-image: url(${cardImage});
        background-size: cover;
        background-position: center;
      `;

      // Create and configure child elements
      const elements = [
        {
          tag: 'h4',
          content: project.project_name || 'Untitled Project',
          className: 'project-title',
        },
        {
          tag: 'p',
          content: project.short_description || 'No description available',
          className: 'project-description',
        },
      ].map(({ tag, content, className }) => {
        const element = document.createElement(tag);
        element.textContent = content;
        if (className) element.className = className;
        return element;
      });

      // Build card structure using spread operator
      projectCard.append(...elements);

      // Add pointerdown listener to update spotlight
      projectCard.addEventListener('pointerdown', () => {
        updateSpotlight(project);

        // Add active state to clicked card and remove from others
        document.querySelectorAll('.projectCard').forEach((card) => {
          card.classList.remove('active');
        });
        projectCard.classList.add('active');
      });

      return projectCard;
    });

  // Use forEach to append all cards to fragment
  projectCards.forEach((card) => fragment.append(card));

  // Single DOM insertion for all cards
  projectList.append(fragment);

  return projectCards;
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

  // Batch background styles
  spotlight.style.cssText += `
    background-image: url(${spotlightImage});
    background-size: cover;
    background-position: center;
  `;

  // Use fragment to batch content creation
  const fragment = document.createDocumentFragment();

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

  // Build structure in fragment
  fragment.append(title, description, link);

  // Clear and replace content in one operation
  spotlightTitles.replaceChildren();
  spotlightTitles.append(fragment);
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
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+$/;
  const illegalCharsRegex = /[^a-zA-Z0-9@._-]/;

  // Update character count
  messageTextarea.addEventListener('input', function () {
    const currentLength = this.value.length;
    charactersLeft.textContent = `Characters: ${currentLength}/300`;

    // Clear message error when user starts typing
    messageError.textContent = '';
  });

  // Clear email error when user starts typing
  emailInput.addEventListener('input', function () {
    emailError.textContent = '';
  });

  // Form submission validation
  form.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent actual form submission

    let isValid = true;

    // Get current values
    const emailValue = emailInput.value.trim();
    const messageValue = messageTextarea.value.trim();

    // Clear previous error messages
    emailError.textContent = '';
    messageError.textContent = '';

    // Email validation
    if (!emailValue) {
      emailError.textContent = 'Email address is required.';
      isValid = false;
    } else if (illegalCharsRegex.test(emailValue)) {
      emailError.textContent =
        'Email contains invalid characters. Only letters, numbers, @, ., _, and - are allowed.';
      isValid = false;
    } else if (!emailRegex.test(emailValue)) {
      emailError.textContent =
        'Please enter a valid email address (e.g., user@example.com).';
      isValid = false;
    }

    // Message validation
    if (!messageValue) {
      messageError.textContent = 'Message is required.';
      isValid = false;
    } else if (messageValue.length > 300) {
      messageError.textContent = 'Message must be 300 characters or less.';
      isValid = false;
    }
    // If all validation passes
    if (isValid) {
      alert(
        'Form validation passed! Your message has been submitted successfully.'
      );
      // Optionally reset the form
      form.reset();
      charactersLeft.textContent = 'Characters: 0/300';
    }
  });
}
// Initialize the page when DOM is loaded

console.log('DOM loaded, calling fetchAboutMe');
fetchAboutMe();
fetchProjects();
setupFormValidation();

// Update header name
const headerTitle = document.querySelector('header h1');
headerTitle.textContent = 'Sean Wildman';
