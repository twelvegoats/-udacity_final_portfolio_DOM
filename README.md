# Personal Portfolio Website

A dynamic personal portfolio website built with vanilla HTML, CSS, and JavaScript that demonstrates modern web development practices including DOM manipulation, responsive design, and client-side form validation.

## 🚀 Live Demo

Open `index.html` in your browser to view the portfolio website.

## ✨ Features

- **Dynamic Content Loading**: Portfolio content is populated from external JSON data files
- **Interactive Project Gallery**: Clickable project cards that update a spotlight section
- **Responsive Design**: Mobile-first approach with tablet and desktop breakpoints
- **Form Validation**: Client-side email and message validation with real-time feedback
- **Character Counter**: Live character counting for message field (300 character limit)
- **Smooth Navigation**: Horizontal/vertical scrolling project navigation
- **Performance Optimized**: Efficient DOM manipulation using document fragments

## 🎓 What I Learned

### JavaScript & DOM Manipulation

- **Fetch API**: Loading and parsing JSON data from external files
- **DOM Traversal**: Selecting and manipulating elements efficiently
- **Event Handling**: Click events, form submission, and input validation
- **Document Fragments**: Optimizing DOM updates for better performance
- **Dynamic Content Creation**: Programmatically generating HTML elements
- **Error Handling**: Graceful fallbacks for missing data and images

### Form Validation & UX

- **Regular Expressions**: Email format validation and character filtering
- **Real-time Validation**: Immediate feedback on user input
- **Error Messaging**: Clear, helpful validation error messages
- **Character Counting**: Dynamic character limit tracking
- **Accessibility**: Proper form labeling and error association

### Project Architecture

- **Separation of Concerns**: Clean separation of HTML, CSS, and JavaScript
- **Data-Driven Design**: Content management through JSON files
- **Modular Code Structure**: Reusable functions and organized code
- **Version Control**: Professional project setup with proper documentation

### Performance & Best Practices

- **Efficient DOM Updates**: Batch operations and fragment usage
- **Code Organization**: Clean, readable, and maintainable code structure
- **Error Prevention**: Defensive programming with fallback values
- **Modern JavaScript**: ES6+ features and best practices

## 🛠 Technologies Used

- **Vanilla JavaScript**: ES6+ features, Fetch API, DOM manipulation
- **JSON**: Data storage and content management

## 🚀 Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Text editor or IDE (VS Code recommended)
- Local development server (optional but recommended)

### Installation

1. **Clone the repository**

   ```bash
   git clone [https://github.com/twelvegoats/-udacity_final_portfolio_DOM]
   cd -udacity_final_portfolio_DOM
   ```

2. Navigate to the starter directory

   ```bash
   cd starter
   ```

3. Open in browser
   - Double-click `index.html`, or
   - Use a local development server

### Using VS Code Live Server (Recommended)

1. Install the Live Server extension in VS Code
2. Right-click on index.html
3. Select "Open with Live Server"
4. The site will open with live reload functionality

## 🔧 Key Implementation Details

### Dynamic Content Loading

```
// Fetch and populate data from JSON files
fetch('./data/aboutMeData.json')
  .then(response => response.json())
  .then(data => populateAboutMe(data));
```

### Form Validation

- Email validation using regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Character filtering: `/[^a-zA-Z0-9@._-]/`
- Real-time character counting with 300 character limit

## 📄 License

This project is licensed under the Creative Commons License - see the LICENSE file for details.

Built with ❤️ as part of my web development journey
