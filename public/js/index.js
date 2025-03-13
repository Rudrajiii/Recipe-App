const btn = document.getElementById("btn");
const progressBar = document.getElementById("progressBar");
const resultDiv = document.getElementById('result');
const LINES_PER_PAGE = 40; //* Almost best for proper pagination in this case
let currentPage = 1;
let totalPages = 1;
let allContent = [];
let currentLanguage = 'en';

// Function to show loading animation
function showLoadingAnimation() {
    resultDiv.innerHTML = `
        <div id="progressBar" class="text-center" style="display: block; position: absolute; top: 6%; left: 50%; transform: translate(-50%, -50%);">
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
        <img id="bot" src="https://tse3.mm.bing.net/th?id=OIP.JU23CZMWiiKqQJl1mKiXQQHaHa&pid=Api&P=0&h=180" alt="">
        <h4 id="botu">Start Generating Your Favourite Recipie's😋</h4>
    `;
}

// Function to hide loading animation
function hideLoadingAnimation() {
    const loader = document.getElementById("progressBar");
    if (loader) {
        loader.style.display = "none";
    }
}

// Function to create pagination controls
function createPaginationControls() {
    const paginationDiv = document.createElement('div');
    

    paginationDiv.style.textAlign = 'center';
    paginationDiv.style.marginTop = '1rem';

    // Previous button
    if (currentPage > 1) {
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.className = 'page-btn';
        prevButton.onclick = () => showPage(currentPage - 1);
        paginationDiv.appendChild(prevButton);
    }

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.className = `page-btn ${i === currentPage ? 'active' : ''}`;
        pageButton.onclick = () => showPage(i);
        paginationDiv.appendChild(pageButton);
    }

    // Next button
    if (currentPage < totalPages) {
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.className = 'page-btn';
        nextButton.onclick = () => showPage(currentPage + 1);
        paginationDiv.appendChild(nextButton);
    }

    // "Watch Tutorial" button
    const tutorialButton = document.createElement('button');
    tutorialButton.textContent = 'Watch Tutorial';
    tutorialButton.className = 'page-btn';
    tutorialButton.onclick = openTutorialModal;
    paginationDiv.appendChild(tutorialButton);


    // Heart Button
    const heartButtonContainer = document.createElement('div');
    heartButtonContainer.style.position = 'absolute';
    heartButtonContainer.style.top = '5px';
    heartButtonContainer.style.right = '5px';
    heartButtonContainer.style.fontSize = '24px';
    heartButtonContainer.style.cursor = 'pointer';  

    const loveButton = document.createElement('button');
    loveButton.className = 'love-button';
    loveButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" 
             viewBox="0 0 24 24" 
             width="20" 
             height="20"
             class="heart-icon">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>`;

    // Add the button to the container
    heartButtonContainer.appendChild(loveButton);

    const style = document.createElement('style');
    style.textContent = `
        .love-button {
            background: white;
            border: none;
            padding: 10px;
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
        }

        .love-button:hover {
            transform: scale(1.1);
            background: #fff0f3;
            box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }

        .heart-icon {
            fill: none;
            stroke: #ff4d6d;
            stroke-width: 2;
            transition: all 0.3s ease;
        }

        .love-button:hover .heart-icon {
            fill: #ff4d6d;
        }

        .love-button.active .heart-icon {
            fill: #ff4d6d;
        }
    `;

    resultDiv.appendChild(heartButtonContainer); // Append heart button to the resultDiv
    document.head.appendChild(style);
    loveButton.addEventListener('click', function() {
        this.classList.toggle('active');
    });
    // Add language dropdown
    const languageSelect = document.createElement('select');
    languageSelect.className = 'language-select';
    
    languageSelect.style.width = '100px';
    languageSelect.style.padding = '10.7px';
    languageSelect.style.border = '1px solid #ccc';
    languageSelect.style.borderRadius = '5px';
    languageSelect.style.fontSize = '17px';
    languageSelect.style.backgroundColor = '#f9f9f9';

    const languages = [
        { code: 'en', name: 'English' },
        { code: 'hi', name: 'Hindi' },
        { code: 'es', name: 'Spanish' },
        { code: 'fr', name: 'French' },
        { code: 'de', name: 'German' },
        { code: 'bn', name: 'Bengali' },
        { code: 'en', name: 'English' },
    ];

    languages.forEach(lang => {
        const option = document.createElement('option');
        option.value = lang.code;
        option.textContent = lang.name;
        if (lang.code === currentLanguage) {
            option.selected = true;
        }
        languageSelect.appendChild(option);
    });

    languageSelect.addEventListener('change', async (e) => {
        try {
            const selectedLang = e.target.value;
            if (selectedLang === 'en') {
                // If English is selected, show original content
                const originalResponse = localStorage.getItem("response#");
                if (originalResponse) {
                    allContent = originalResponse.split('\n').map(line => document.createTextNode(line));
                    showPage(currentPage);
                }
                return;
            }

            const response = localStorage.getItem("response#");
            languageSelect.innerHTML = e.target.value;
            if (!response) {
                console.error("No response found in localStorage");
                return;
            }

            showLoadingAnimation();

            const result = await fetch(`/translate?text=${encodeURIComponent(response)}&targetLang=${selectedLang}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!result.ok) {
                throw new Error(`HTTP error! status: ${result.status}`);
            }

            const data = await result.json();
            console.log('Translated text:', data);

            // Ensure the translated text is a string
            let translateContent = data.translatedText.translated;

            const translatedText = typeof data.translatedText.translated === 'string'
                ? translateContent.split('\n').map(line => document.createTextNode(line))
                : JSON.stringify(translateContent.split('\n').map(line => document.createTextNode(line)) || data);
            // resultDiv.innerText = translatedText.translated;
            // Update content with translated text
            allContent = translateContent.split('\n').map(line => document.createTextNode(line));
            showPage(currentPage);

        } catch (error) {
            console.error('Translation failed:', error);
        } finally {
            hideLoadingAnimation();
        }
    });

    paginationDiv.appendChild(languageSelect);
    return paginationDiv;
}

// Function to open the tutorial modal
async function openTutorialModal() {
    let userInput = localStorage.getItem("userPrompt");
    if (userInput.length >= 30) {
        userInput = userInput.split(" ").join("");
    }

    // Show loading spinner while fetching data
    const modal = document.createElement('div');
    modal.className = 'tutorial-modal';
    modal.innerHTML = `
      <div class="tutorial-modal-content">
        <span class="tutorial-close-btn" onclick="closeTutorialModal()">&times;</span>
        <h2>Fetching Tutorial...</h2>
        <div class="loading-spinner">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    try {
        const response = await fetch(`/getTutorial?userInput=${encodeURIComponent(userInput)}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch, status: ${response.status}`);
        }

        const tutorialData = await response.json();

        // Update modal with the fetched tutorial data
        modal.innerHTML = `
        <div class="tutorial-modal-content">
          <span class="tutorial-close-btn" onclick="closeTutorialModal()">&times;</span>
          <h2>Tutorial: ${tutorialData.title}</h2>
          <p>${tutorialData.description}</p>
          <a href="${tutorialData.videoUrl}" target="_blank">Watch Tutorial</a> 
          <img src="${tutorialData.thumbnail}" alt="${tutorialData.title}" style="width:100%">
        </div>
      `;
    } catch (error) {
        console.error('Error fetching tutorial:', error);
        alert(`Failed to fetch tutorial: ${error.message}`);
        closeTutorialModal();
    }
}

// Function to close the tutorial modal
function closeTutorialModal() {
    const modal = document.querySelector('.tutorial-modal');
    if (modal) {
        modal.remove();
    }
}

// Function to show content for the current page
function showPage(pageNum) {
    currentPage = pageNum;
    const startIndex = (pageNum - 1) * LINES_PER_PAGE;
    const endIndex = startIndex + LINES_PER_PAGE;
    const pageContent = allContent.slice(startIndex, endIndex);

    // Clear previous content
    resultDiv.innerHTML = '';

    // Show initial content if no data
    if (pageNum === 1 && allContent.length === 0) {
        resultDiv.innerHTML = `
            <img id="bot" src="https://tse3.mm.bing.net/th?id=OIP.JU23CZMWiiKqQJl1mKiXQQHaHa&pid=Api&P=0&h=180" alt="">
            <h4 id="botu">Start Generating Your Favourite Recipie's😋</h4>
        `;
        return;
    }

    // Create content container
    const contentDiv = document.createElement('div');
    contentDiv.style.minHeight = '200px'; // Ensure minimum height for content

    // Add content
    pageContent.forEach(node => {
        contentDiv.appendChild(node);
        contentDiv.appendChild(document.createElement('br'));
    });

    resultDiv.appendChild(contentDiv);

    // Add pagination controls if there's content
    if (allContent.length > 0) {
        const paginationControls = createPaginationControls();
        resultDiv.appendChild(paginationControls);
    }
}

// Event listener for generating content on button click
btn.addEventListener('click', async () => {
    try {
        const userInput = document.getElementById('input').value;
        localStorage.setItem("userPrompt", userInput);
        showLoadingAnimation();

        // Fetch data from API with user input as prompt
        const response = await fetch(`/api?prompt=${encodeURIComponent(userInput)}`);

        const data = await response.json();
        // console.log("json data = ", data);
        if (!response.ok) {
            throw new Error(data.error || 'Network response was not ok');
        }
        // console.log(data.response);
        // console.log("ANALYZED DATA => ",data.analysis);
        localStorage.setItem("<RAW_MARKDOWN>", data.analysis);
        const recipeId = data.recipeId; // Get the recipeId from the response
        const recipeLink = data.recipeLink; // Get the recipeLink from the response
        localStorage.setItem("recipeId", recipeId);
        localStorage.setItem("recipeLink", recipeLink);
        localStorage.setItem("response#", data.response);

        // Process the response
        allContent = data.response.split('\n').map(line => document.createTextNode(line));

        // Calculate total pages
        totalPages = Math.ceil(allContent.length / LINES_PER_PAGE);
        // console.log("processed content = ", allContent);

        // Show first page
        currentPage = 1;
        showPage(1);

        document.getElementById('input').value = '';
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.message,
          });
        console.error('There was a problem with the fetch operation:', error);
    } finally {
        hideLoadingAnimation();
    }
});

// Event listener for "Enter" key press on the input field
document.getElementById('input').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent default form submission
        document.getElementById('btn').click(); // Trigger click event on the generate button
    }
});

showPage(1);
