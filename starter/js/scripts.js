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

    // Clear email error when user starts typing
    emailInput.addEventListener('input', function () {
      emailError.textContent = '';
    });
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
    } else if (!emailRegex.test(emailValue)) {
      emailError.textContent =
        'Please enter a valid email address (e.g., user@example.com).';
      isValid = false;
    } else if (illegalCharsRegex.test(emailValue)) {
      emailError.textContent =
        'Email contains invalid characters. Only letters, numbers, @, ., _, and - are allowed.';
      isValid = false;
    }

    // Message validation
    if (!messageValue) {
      messageError.textContent = 'Message is required.';
      isValid = false;
    } else if (messageValue.length > 300) {
      messageError.textContent = 'Message must be 300 characters or less.';
      isValid = false;
    } else if (illegalCharsRegex.test(messageValue)) {
      messageError.textContent =
        'Message contains invalid characters. Only letters, numbers, @, ., _, and - are allowed.';
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

// Function to enhance navbar styling with JavaScript - Optimized for minimal redraws
function enhanceNavbarStyling() {
  const nav = document.querySelector('nav');
  const navUl = document.querySelector('nav ul');
  const navLinks = document.querySelectorAll('nav a');
  const navItems = document.querySelectorAll('nav li');

  // Hide elements during styling to prevent redraws
  nav.style.visibility = 'hidden';

  // Batch all nav container styles
  nav.style.cssText = `
    padding: 0 30px 0 0;
    margin: 0 20px 0 0;
    width: 30%;
    display: flex;
    flex: 0 0 auto;
    justify-content: flex-end;
    visibility: hidden;
  `;

  // Batch all ul styles
  navUl.style.cssText = `
    list-style-type: none;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    font-size: .9rem;
    font-weight: 500;
    gap: 15px;
    width: 100%;
    margin: 0;
    padding: 15px 20px;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
    backdrop-filter: blur(10px);
    border-radius: 15px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  `;

  // Batch link styles
  navLinks.forEach((link) => {
    link.style.cssText = `
      text-decoration: none;
      position: relative;
      overflow: hidden;
    `;
  });

  // Use DocumentFragment to batch DOM manipulations
  navItems.forEach((item, index) => {
    // Batch all item styles
    item.style.cssText = `
      transition: all .4s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
      padding: 8px 15px;
      border-radius: 8px;
      position: relative;
      color: var(--onLightBG);
      font-weight: 500;
      letter-spacing: 0.5px;
      white-space: nowrap;
      opacity: 0;
      transform: translateX(-20px);
    `;

    // Create elements without triggering reflows
    const underline = document.createElement('div');
    underline.style.cssText = `
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 2px;
      background: linear-gradient(90deg, #007bff, #00d4ff);
      transition: width 0.3s ease;
      pointer-events: none;
    `;

    const glowBorder = document.createElement('div');
    glowBorder.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 8px;
      border: 1px solid transparent;
      background: linear-gradient(135deg, transparent, rgba(0, 123, 255, 0.3), transparent);
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;
      z-index: -1;
    `;

    // Batch DOM insertions using append
    item.append(underline, glowBorder);

    // Add event listeners (these don't cause redraws)
    item.addEventListener('mouseenter', () => {
      item.style.cssText += `
        transform: translateY(-3px) scale(1.05);
        background: linear-gradient(135deg, rgba(0, 123, 255, 0.1), rgba(0, 123, 255, 0.05));
        color: #007bff;
        box-shadow: 0 4px 15px rgba(0, 123, 255, 0.2);
      `;
      underline.style.width = '100%';
      glowBorder.style.opacity = '1';
    });

    item.addEventListener('mouseleave', () => {
      item.style.cssText =
        item.style.cssText.replace(
          /transform:.*?;|background:.*?;|color:.*?;|box-shadow:.*?;/g,
          ''
        ) +
        `
        transform: translateY(0) scale(1);
        background: transparent;
        color: var(--onLightBG);
        box-shadow: none;
      `;
      underline.style.width = '0';
      glowBorder.style.opacity = '0';
    });
  });

  // Use requestAnimationFrame to batch the final visibility change and animations
  requestAnimationFrame(() => {
    nav.style.visibility = 'visible';

    // Stagger animations using a single RAF callback
    navItems.forEach((item, index) => {
      setTimeout(() => {
        requestAnimationFrame(() => {
          item.style.opacity = '1';
          item.style.transform = 'translateX(0)';
        });
      }, index * 150);
    });
  });
}

// Alternative styling functions for different looks
function applyGlassMorphismNav() {
  const navUl = document.querySelector('nav ul');
  Object.assign(navUl.style, {
    background: 'rgba(255, 255, 255, 0.25)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  });
}

function applyNeonNav() {
  const navUl = document.querySelector('nav ul');
  const navItems = document.querySelectorAll('nav li');

  Object.assign(navUl.style, {
    background: 'rgba(0, 0, 0, 0.8)',
    border: '1px solid #00d4ff',
    boxShadow:
      '0 0 20px rgba(0, 212, 255, 0.3), inset 0 0 20px rgba(0, 212, 255, 0.1)',
  });

  navItems.forEach((item) => {
    Object.assign(item.style, {
      color: '#00d4ff',
      textShadow: '0 0 10px rgba(0, 212, 255, 0.5)',
    });

    item.addEventListener('mouseenter', () => {
      Object.assign(item.style, {
        color: '#ffffff',
        textShadow: '0 0 20px rgba(0, 212, 255, 0.8)',
        boxShadow: '0 0 15px rgba(0, 212, 255, 0.4)',
      });
    });

    item.addEventListener('mouseleave', () => {
      Object.assign(item.style, {
        color: '#00d4ff',
        textShadow: '0 0 10px rgba(0, 212, 255, 0.5)',
        boxShadow: 'none',
      });
    });
  });
}

function applyGradientNav() {
  const navUl = document.querySelector('nav ul');
  const navItems = document.querySelectorAll('nav li');

  Object.assign(navUl.style, {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
  });

  navItems.forEach((item) => {
    item.style.color = 'rgba(255, 255, 255, 0.9)';

    item.addEventListener('mouseenter', () => {
      Object.assign(item.style, {
        background: 'rgba(255, 255, 255, 0.2)',
        color: 'white',
        transform: 'translateX(-5px) scale(1.05)',
      });
    });

    item.addEventListener('mouseleave', () => {
      Object.assign(item.style, {
        background: 'transparent',
        color: 'rgba(255, 255, 255, 0.9)',
        transform: 'translateX(0) scale(1)',
      });
    });
  });
}

function applyFloatingCardsNav() {
  const navUl = document.querySelector('nav ul');
  const navItems = document.querySelectorAll('nav li');

  Object.assign(navUl.style, {
    background: 'transparent',
    border: 'none',
    boxShadow: 'none',
    gap: '20px',
  });

  navItems.forEach((item) => {
    Object.assign(item.style, {
      background: 'white',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
      borderRadius: '12px',
      padding: '12px 20px',
    });

    item.addEventListener('mouseenter', () => {
      Object.assign(item.style, {
        transform: 'translateY(-5px) scale(1.05)',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
        background: 'linear-gradient(135deg, #007bff, #00d4ff)',
        color: 'white',
      });
    });

    item.addEventListener('mouseleave', () => {
      Object.assign(item.style, {
        transform: 'translateY(0) scale(1)',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
        background: 'white',
        color: 'var(--onLightBG)',
      });
    });
  });
}

// Function to switch between different navbar styles
function switchNavbarStyle(styleName) {
  // First apply base styling
  enhanceNavbarStyling();

  // Then apply specific style
  switch (styleName) {
    case 'glass':
      applyGlassMorphismNav();
      break;
    case 'neon':
      applyNeonNav();
      break;
    case 'gradient':
      applyGradientNav();
      break;
    case 'floating':
      applyFloatingCardsNav();
      break;
    default:
      // Default enhanced styling is already applied
      break;
  }
}

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM loaded, calling fetchAboutMe');
  fetchAboutMe();
  fetchProjects();
  setupFormValidation();
  enhanceNavbarStyling();

  // Update header name
  const headerTitle = document.querySelector('header h1');
  headerTitle.textContent = 'Sean Wildman';
});
