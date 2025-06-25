// Mock Data for courses and user progress
const mockCourses = [
    {
        id: 'course-1',
        title: 'Introduction to Web Development',
        description: 'Learn the basics of HTML, CSS, and JavaScript to build web pages.',
        image: 'https://placehold.co/400x200/ADD8E6/000000?text=Web+Dev',
        videoUrl: 'https://www.youtube.com/embed/videoseries?list=PL4cUxeGkcC9jo_Gv-A0W40e5ga7S1b_E-', // Example YouTube playlist (not working)
        modules: [
            { id: 'mod-1-1', title: 'HTML Basics', completed: false },
            { id: 'mod-1-2', title: 'CSS Styling', completed: false },
            { id: 'mod-1-3', title: 'JavaScript Fundamentals', completed: false },
        ],
    },
    {
        id: 'course-2',
        title: 'Data Science with Python',
        description: 'Explore data analysis and machine learning using Python.',
        image: 'https://placehold.co/400x200/90EE90/000000?text=Data+Science',
        videoUrl: 'https://www.youtube.com/embed/videoseries?list=PLQVvvaa0QuDfKJPW_C6BfX-gO3dnf2YdO',
        modules: [
            { id: 'mod-2-1', title: 'Python for Data Science', completed: false },
            { id: 'mod-2-2', title: 'NumPy and Pandas Basics', completed: false },
            { id: 'mod-2-3', title: 'Data Visualization Intro', completed: false },
        ],
    },
    {
        id: 'course-3',
        title: 'Machine Learning Fundamentals',
        description: 'Get your hands on machine learning.',
        image: 'https://placehold.co/400x200/FFDAB9/000000?text=Machine+Learning',
        videoUrl: 'https://www.youtube.com/embed/videoseries?list=PLD5_e2M0l3f2j5b4e8y3C8h2f9l2h8n1q',
        modules: [
            { id: 'mod-3-1', title: 'Elements of Design', completed: false },
            { id: 'mod-3-2', title: 'Color Theory', completed: false },
            { id: 'mod-3-3', title: 'Typography Basics', completed: false },
        ],
    },
];

// Store current user progress in localStorage
let userProgress = JSON.parse(localStorage.getItem('userProgress')) || {};

// Function to update local storage with current progress
function saveProgress() {
    localStorage.setItem('userProgress', JSON.stringify(userProgress));
}

// Helper function to calculate course progress
function calculateProgress(courseId) {
    const course = mockCourses.find(c => c.id === courseId);
    if (!course || !course.modules || course.modules.length === 0) {
        return 0;
    }

    const currentCourseProgress = userProgress[courseId] || {};
    let completedCount = 0;
    for (let i = 0; i < course.modules.length; i++) {
        if (currentCourseProgress[course.modules[i].id]) {
            completedCount++;
        }
    }
    return (completedCount / course.modules.length) * 100;
}

const courseListingPage = document.getElementById('courseListingPage');
const courseDetailPage = document.getElementById('courseDetailPage');
const courseCardsContainer = document.getElementById('courseCardsContainer');
const courseCardTemplate = document.getElementById('courseCardTemplate');
const moduleItemTemplate = document.getElementById('moduleItemTemplate');

const courseDetailTitle = document.getElementById('courseDetailTitle');
const courseDetailDescription = document.getElementById('courseDetailDescription');
const courseVideoPlayer = document.getElementById('courseVideoPlayer');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const moduleList = document.getElementById('moduleList');
const homeBtn = document.getElementById('homeBtn');
const backToCoursesBtn = document.getElementById('backToCoursesBtn');

let currentCourseId = null; // To keep track of the currently viewed course

// Page Navigation Functions
function showPage(pageId) {
    // Hide all pages
    const allPages = document.querySelectorAll('.page');
    for (let i = 0; i < allPages.length; i++) {
        allPages[i].classList.add('hidden');
    }
    // Show the requested page
    document.getElementById(pageId).classList.remove('hidden');
}

// Render Course Listing
function renderCourseListing() {
    courseCardsContainer.innerHTML = ''; // Clear previous cards
    for (let i = 0; i < mockCourses.length; i++) {
        const course = mockCourses[i];
        const cardClone = document.importNode(courseCardTemplate.content, true);
        const card = cardClone.querySelector('.course-card');
        const img = card.querySelector('.course-card-image');
        const title = card.querySelector('.course-card-title');
        const description = card.querySelector('.course-card-description');
        const progBar = card.querySelector('.course-card-progress-fill');
        const progText = card.querySelector('.course-card-progress-text');
        const viewBtn = card.querySelector('.view-course-button');

        card.dataset.courseId = course.id;
        img.src = course.image;
        img.alt = course.title;
        title.textContent = course.title;
        description.textContent = course.description;

        const progress = calculateProgress(course.id);
        progBar.style.width = `${Math.round(progress)}%`; // Round for display
        progText.textContent = `${Math.round(progress)}% Completed`;

        // Event listener to view course details
        viewBtn.onclick = function(event) {
            event.stopPropagation(); // Prevent card click if button is clicked
            displayCourseDetail(course.id);
            showPage('courseDetailPage');
        };

        // Make the whole card clickable
        card.onclick = function() {
            displayCourseDetail(course.id);
            showPage('courseDetailPage');
        };

        courseCardsContainer.appendChild(cardClone);
    }
}

// Display Course Details
function displayCourseDetail(courseId) {
    currentCourseId = courseId;
    const course = mockCourses.find(c => c.id === courseId);
    if (!course) {
        console.error('Course not found:', courseId);
        showPage('courseListingPage');
        return;
    }

    courseDetailTitle.textContent = course.title;
    courseDetailDescription.textContent = course.description;
    courseVideoPlayer.src = course.videoUrl;

    // Clear previous modules
    moduleList.innerHTML = '';
    userProgress[courseId] = userProgress[courseId] || {}; // Initialize progress for this course if not exists

    for (let i = 0; i < course.modules.length; i++) {
        const module = course.modules[i];
        const moduleClone = document.importNode(moduleItemTemplate.content, true);
        const moduleItem = moduleClone.querySelector('.module-item');
        const moduleTitle = moduleItem.querySelector('.module-title');
        const moduleCheckbox = moduleItem.querySelector('.module-checkbox');

        moduleTitle.textContent = module.title;
        moduleCheckbox.dataset.moduleId = module.id;

        // Set checkbox state based on stored user progress
        if (userProgress[courseId][module.id]) {
            moduleCheckbox.checked = true;
            moduleItem.classList.add('completed');
        } else {
            moduleCheckbox.checked = false;
            moduleItem.classList.remove('completed');
        }

        // Add event listener for checkbox changes
        moduleCheckbox.onchange = function(event) { // Use simpler onchange
            userProgress[courseId][module.id] = event.target.checked;
            saveProgress();
            updateCourseProgressUI(courseId); // Update progress bar and text
            if (event.target.checked) {
                moduleItem.classList.add('completed');
            } else {
                moduleItem.classList.remove('completed');
            }
            // Re-render course listing to update card progress
            renderCourseListing();
        };

        moduleList.appendChild(moduleClone);
    }

    updateCourseProgressUI(courseId);
}

// Function to update progress bar and text on the detail page
function updateCourseProgressUI(courseId) {
    const progress = calculateProgress(courseId);
    progressBar.style.width = `${Math.round(progress)}%`;
    progressText.textContent = `${Math.round(progress)}% Completed`;
}

// Event Listeners for Navigation
homeBtn.onclick = function() { // Use simpler onclick
    showPage('courseListingPage');
    // Reset video player when navigating away from detail page
    courseVideoPlayer.src = '';
};

backToCoursesBtn.onclick = function() { // Use simpler onclick
    showPage('courseListingPage');
    // Reset video player when navigating away from detail page
    courseVideoPlayer.src = '';
};

// Initial render on page load
document.addEventListener('DOMContentLoaded', function() {
    renderCourseListing();
    showPage('courseListingPage'); // Start on the course listing page
});

