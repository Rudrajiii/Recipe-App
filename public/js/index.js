const btn = document.getElementById("btn");
const progressBar = document.getElementById("progressBar");
const resultDiv = document.getElementById('result');
const LINES_PER_PAGE = 40; //* Almost best for proper pagination in this case
let currentPage = 1;
let totalPages = 1;
let allContent = [];
let currentLanguage = 'en';

// Function to format text with bold headings and bullet points
function formatResponseText(text) {
    const div = document.createElement('div');
    
    let formattedText = text;
    
    // Check if line starts with "* " for bullet points
    const trimmedText = text.trim();
    if (trimmedText.startsWith('* ')) {
        // Convert to bullet point - remove the "* " and wrap in bullet structure
        const bulletContent = trimmedText.substring(2); // Remove "* "
        formattedText = `• ${bulletContent}`;
    } else {
        // Handle **text** for bold headings (like **Tips and Variations:**)
        formattedText = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    }
    
    // Set the content
    div.innerHTML = formattedText;
    
    // Remove ALL gaps and spacing
    div.style.fontSize = 'inherit';
    div.style.padding = '0';
    div.style.margin = '0';
    div.style.lineHeight = 'inherit';
    div.style.display = 'block';
    
    return div;
}

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
                // If English is selected, show original content with formatting
                const originalResponse = localStorage.getItem("response#");
                if (originalResponse) {
                    allContent = originalResponse.split('\n').map(line => formatResponseText(line));
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
                ? translateContent.split('\n').map(line => formatResponseText(line))
                : JSON.stringify(translateContent.split('\n').map(line => formatResponseText(line)) || data);
            // resultDiv.innerText = translatedText.translated;
            // Update content with translated text
            allContent = translateContent.split('\n').map(line => formatResponseText(line));
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


// Add this helper function to truncate text
function truncateText(text, maxLength) {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

function getDefaultNutritionData() {
  return {
    calories: { amount: "N/A", unit: "" },
    macronutrients: {
      protein: { amount: "N/A", unit: "", dv: "N/A" },
      fat: { amount: "N/A", unit: "", dv: "N/A" },
      carbohydrates: { amount: "N/A", unit: "", dv: "N/A" },
      sugar: { amount: "N/A", unit: "", dv: "N/A" },
    },
    micronutrients: { vitamins: [], minerals: [] },
    dietaryComponents: {
      fiber: { amount: "N/A", unit: "", dv: "N/A" },
      cholesterol: { amount: "N/A", unit: "", dv: "N/A" },
      sodium: { amount: "N/A", unit: "", dv: "N/A" },
    },
    otherComponents: { transFats: "N/A", saturatedFats: "N/A", additionalInfo: "N/A" },
    healthEffects: "N/A",
  };
}

function extractNutritionStats(analysisString) {
  try {
    const jsonMatch = analysisString.match(/```json\s*({[\s\S]*?})\s*```/);
    if (!jsonMatch) {
      console.error("No JSON found in analysis string.");
      return getDefaultNutritionData();
    }

    const analysisJson = JSON.parse(jsonMatch[1]);

    // Helper function to parse micronutrients
    function formatMicronutrients(data) {
      if (!data || typeof data !== "object") {
        console.error("Micronutrient data is missing or invalid.");
        return { vitamins: [], minerals: [] };
      }

      const formattedVitamins = data.vitamins && typeof data.vitamins === "string"
        ? data.vitamins.split(", ").map(item => {
            if (!item.includes(":")) return [item.trim(), "N/A"];
            const [name, value] = item.split(":");
            return [name.trim(), value.trim()];
          })
        : [];

      const formattedMinerals = data.minerals && typeof data.minerals === "string"
        ? data.minerals.split(", ").map(item => {
            if (!item.includes(":")) return [item.trim(), "N/A"];
            const [name, value] = item.split(":");
            return [name.trim(), value.trim()];
          })
        : [];

      return { vitamins: formattedVitamins, minerals: formattedMinerals };
    }

    // Extract calories
    let caloriesAmount = "N/A";
    let caloriesUnit = "";
    if (analysisJson.calories) {
      const match = String(analysisJson.calories).match(/(\d+(?:\.\d+)?)\s*([a-zA-Z]+)?/);
      if (match) {
        caloriesAmount = match[1];
        caloriesUnit = match[2] || "";
      } else {
        caloriesAmount = analysisJson.calories;
      }
    }

    // Extract macronutrients
    const macronutrients = {
      protein: {
        amount: analysisJson.macronutrients?.protein?.amount || "N/A",
        unit: extractUnit(analysisJson.macronutrients?.protein?.amount),
        dv: analysisJson.macronutrients?.protein?.percent_dv || "N/A",
      },
      fat: {
        amount: extractAmount(analysisJson.macronutrients?.fat?.amount),
        unit: extractUnit(analysisJson.macronutrients?.fat?.amount),
        dv: analysisJson.macronutrients?.fat?.percent_dv || "N/A",
      },
      carbohydrates: {
        amount: extractAmount(analysisJson.macronutrients?.carbohydrates?.amount),
        unit: extractUnit(analysisJson.macronutrients?.carbohydrates?.amount),
        dv: analysisJson.macronutrients?.carbohydrates?.percent_dv || "N/A",
      },
      sugar: {
        amount: extractAmount(analysisJson.macronutrients?.sugar?.amount),
        unit: extractUnit(analysisJson.macronutrients?.sugar?.amount),
        dv: analysisJson.macronutrients?.sugar?.percent_dv || "N/A",
      },
    };

    // Extract micronutrients
    const { vitamins, minerals } = formatMicronutrients(analysisJson.micronutrients);

    // Extract dietary components
    const dietaryComponents = {
      fiber: {
        amount: extractAmount(analysisJson.dietary_fiber?.amount),
        unit: extractUnit(analysisJson.dietary_fiber?.amount),
        dv: analysisJson.dietary_fiber?.percent_dv || "N/A",
      },
      cholesterol: {
        amount: extractAmount(analysisJson.cholesterol?.amount),
        unit: extractUnit(analysisJson.cholesterol?.amount),
        dv: analysisJson.cholesterol?.percent_dv || "N/A",
      },
      sodium: {
        amount: extractAmount(analysisJson.sodium?.amount),
        unit: extractUnit(analysisJson.sodium?.amount),
        dv: analysisJson.sodium?.percent_dv || "N/A",
      },
    };

    // Extract other components
    const otherComponents = {
      transFats: analysisJson.other_components?.trans_fats || "N/A",
      saturatedFats: analysisJson.other_components?.saturated_fats || "N/A",
      additionalInfo: analysisJson.other_components?.additional_info || "N/A",
    };

    // Extract health effects
    const healthEffects = analysisJson.health_effects || "N/A";

    // Return the complete nutrition data
    return {
      calories: { amount: caloriesAmount, unit: caloriesUnit },
      macronutrients,
      micronutrients: { vitamins, minerals },
      dietaryComponents,
      otherComponents,
      healthEffects,
    };
  } catch (error) {
    console.error("Error parsing analysis JSON:", error);
    return getDefaultNutritionData();
  }
}

// Helper functions to extract amount and unit from strings like "4 g"
function extractAmount(valueString) {
  if (!valueString || typeof valueString !== "string") return "N/A";
  const match = valueString.match(/(\d+(?:\.\d+)?)/);
  return match ? match[1] : "N/A";
}

function extractUnit(valueString) {
  if (!valueString || typeof valueString !== "string") return "";
  const match = valueString.match(/(\d+(?:\.\d+)?)\s*([a-zA-Z]+)/);
  return match ? match[2] : "";
}



function generateNutritionUI(nutritionData) {
  const { calories, macronutrients, micronutrients, dietaryComponents, otherComponents, healthEffects } = nutritionData;

  // Helper function to create a styled row for key-value pairs
  function createRow(key, value) {
    return `
      <div class="nutrition-row">
        <span class="nutrition-key">${key}:</span>
        <span class="nutrition-value">${value}</span>
      </div>
    `;
  }

  // Generate HTML for each section
  const caloriesHTML = createRow("Calories", `${calories.amount} ${calories.unit}`);
  
  const macronutrientsHTML = Object.entries(macronutrients)
    .map(([name, data]) => {
      const valueText = data.amount !== "N/A" 
        ? `${data.amount} ${data.unit} (${data.dv})` 
        : "N/A";
      return createRow(name.charAt(0).toUpperCase() + name.slice(1), valueText);
    })
    .join("");

  const vitaminsHTML = micronutrients.vitamins.length
    ? `<h4
      style=
        "
            background: #FFF8E1;
            width: 7.7rem;
            padding: 0.4rem;
            border-radius: .7rem;
            color: #FFA000;
        "
    >Vitamins</h4>${micronutrients.vitamins.map(([name, value]) => createRow(name, value)).join("")}`
    : "";

  const mineralsHTML = micronutrients.minerals.length
    ? `<h4
      style=
        "
            background: #F7FBFC;
            width: 7.7rem;
            padding: 0.4rem;
            border-radius: .7rem;
            color: #4CAF50;
        "
    >Minerals</h4>${micronutrients.minerals.map(([name, value]) => createRow(name, value)).join("")}`
    : "";

  const dietaryComponentsHTML = Object.entries(dietaryComponents)
    .map(([name, data]) => {
      const valueText = data.amount !== "N/A" 
        ? `${data.amount} ${data.unit} (${data.dv})` 
        : "N/A";
      return createRow(name.charAt(0).toUpperCase() + name.slice(1), valueText);
    })
    .join("");

  const otherComponentsHTML = Object.entries(otherComponents)
    .map(([key, value]) => createRow(key.replace(/([A-Z])/g, " $1").trim(), value)) // Add spaces before capital letters
    .join("");

  const healthEffectsHTML = healthEffects !== "N/A" ? `<h4
  style=
        "
            background: #F3E5F5;
            width: 7.7rem;
            padding: 0.4rem;
            border-radius: .7rem;
            color: #9C27B0;
        "
  >Health Effects</h4><p>${healthEffects}</p>` : "";

  // Combine all sections into one HTML structure
  return `
    <div class="nutrition-section">
      ${caloriesHTML}
      <h4 
        style=
        "
            background:rgb(214, 240, 214);
            width: 7.7rem;
            padding: 0.4rem;
            border-radius: .7rem;
            color: rgb(70, 168, 74);
        "
      >
        Macronutrients
      </h4>
      ${macronutrientsHTML}
      ${vitaminsHTML}
      ${mineralsHTML}
      <h4
      style=
        "
            background: #FFF3E0;
            width: 7.7rem;
            padding: 0.4rem;
            border-radius: .7rem;
            color: #FF9800;
        "
      >Dietary Components</h4>
      ${dietaryComponentsHTML}
      <h4
      style="
            background: #E3F2FD;
            width: 7.7rem;
            padding: 0.4rem;
            border-radius: .7rem;
            color: #1976D2;
        "
      >Other Components</h4>
      ${otherComponentsHTML}
      ${healthEffectsHTML}
    </div>
  `;
}

// Update your openTutorialModal function by replacing the modal.innerHTML section with this:
async function openTutorialModal() {
  let userInput = localStorage.getItem("userPrompt");
  
  // No need for manual optimization - Groq will handle it on the backend!

  // Show loading spinner while fetching data
  const modal = document.createElement('div');
  modal.className = 'tutorial-modal';

  modal.innerHTML = `
    <div class="tutorial-modal-content">
      <span class="tutorial-close-btn" onclick="closeTutorialModal()">&times;</span>
      <div class="loading-container">
        <h2>Finding your recipe...</h2>
        <div class="food-loading-animation">
          <div class="plate"></div>
          <div class="fork"></div>
          <div class="knife"></div>
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

    const tutorials = await response.json();

    // Check if tutorials array is empty
    if (!Array.isArray(tutorials) || tutorials.length === 0) {
      throw new Error('No tutorials found.');
    }

    // Dynamically generate HTML for each tutorial
    const tutorialCards = tutorials
      .map(
        (tutorial) => `
          <div class="tutorial-card">
            <div class="tutorial-card-img">
              <img src="${tutorial.thumbnail}" alt="Tutorial step">
            </div>
            <div class="tutorial-card-text">
              <h3>
                <a style="text-decoration: none;" href="${tutorial.videoUrl}" title="${formatTitle(tutorial.title)}">${formatTitle(tutorial.title)}</a>
              </h3>
              <p>${tutorial.description || 'Follow our simple preparation steps for best results.'}</p>
            </div>
          </div>
        `
      )
      .join("");

    // Update modal with the fetched tutorial data
    modal.innerHTML = `
      <div class="tutorial-modal-content">
        <!-- Left Side - Tutorial Cards -->
        <div class="tutorial-left-side">
          ${tutorialCards}
        </div>

        <!-- Right Side - Recipe Details -->
        <div class="tutorial-right-side">
          <div class="simple-notice">
            All the videos are coming might not be as exact as the prompt given by you. But you can always check the recipe by clicking on the title.
          </div>

          <div class="recipe-title">
            <h2 id="fck-head">${formatTitle(localStorage.getItem("userPrompt"))}</h2>
          </div>

          <div class="recipe-description">
              ${generateNutritionUI(extractNutritionStats(localStorage.getItem("<RAW_MARKDOWN>")))}
          </div>

          <div class="action-buttons">
            <button class="save-button">
              <i class="fas fa-save"></i> Save
            </button>
            <button class="more-button">Close</button>
          </div>
        </div>
      </div>
    `;

    // Add event listeners for the buttons
    const saveButton = modal.querySelector('.save-button');
    const moreButton = modal.querySelector('.more-button');

    saveButton.addEventListener('click', () => {
      alert('Recipe saved to your collection!');
    });

    moreButton.addEventListener('click', () => {
      const modal = document.querySelector('.tutorial-modal');
      if (modal) {
        modal.classList.add('fade-out');
        setTimeout(() => {
          document.body.removeChild(modal);
        }, 300); // Match this with your CSS transition time
      }
    });

  } catch (error) {
    console.error('Error fetching tutorial:', error);
    alert(`Failed to fetch recipe: ${error.message}`);
    closeTutorialModal();
  }
}



function formatTitle(title) {
    if (!title) return ""; // Handle cases where title might be null or undefined
    return title.charAt(0).toUpperCase() + title.slice(1).toLowerCase();
  }

function closeTutorialModal() {
    const modal = document.querySelector('.tutorial-modal');
    if (modal) {
      modal.classList.add('fade-out');
      setTimeout(() => {
        document.body.removeChild(modal);
      }, 300); // Match this with your CSS transition time
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

    // Add content without extra line breaks
    pageContent.forEach(node => {
        contentDiv.appendChild(node);
        // Don't add br elements - the div elements will handle line breaks naturally
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

        // Process the response with formatting
        allContent = data.response.split('\n').map(line => formatResponseText(line));

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

const styleElement = document.createElement('style');
styleElement.textContent = `
  .tutorial-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-in-out;
  overflow: auto;
  font-family: Arial, sans-serif; 
}
#fck-head{
  font-size: 1.7rem;
  font-family: fantasy;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.fade-out {
  animation: fadeOut 0.3s ease-in-out;
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

.tutorial-modal-content {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 1000px;
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  padding: 20px;
  position: relative;
  border: 2px solid #e8e8e8;
  margin: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.tutorial-close-btn {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  color: #666;
  z-index: 10;
}

.tutorial-close-btn:hover {
  color: #000;
}

/* Two-column layout */
.tutorial-left-side {
  flex: 1;
  padding-right: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow-y: scroll;
}

.tutorial-right-side {
  flex: 1;
  border-left: 1px solid #eaeaea;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
}

/* Tutorial cards */
.tutorial-card {
  background-color: #f6f8fa;
  border-radius: 8px;
  overflow: hidden;
  min-height: 20rem;
  margin-bottom: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  border: 1px solid #e0e0e0;
}

.tutorial-card-img {
  height: 200px;
  overflow: hidden;
  background-color: #eee;
}

.tutorial-card-img img {
  width: 100%;
  height: 100%;
  background-position: center;
  object-fit: cover;
}

.tutorial-card-text {
  padding: 15px;
}

.tutorial-card-text h3 {
  margin-top: 0;
  color: #333;
  font-size: 18px;
}

.tutorial-card-text p {
  color: #666;
  font-size: 14px;
  margin-bottom: 0;
}

/* Arrow down */
.arrow-down {
  text-align: center;
  font-size: 24px;
  color: #999;
  margin: 10px 0;
}

/* Right side content */
.simple-notice {
  background-color: #FFF3CD;
  color: #856404;
  padding: 10px 15px;
  border-radius: 5px;
  margin-bottom: 15px;
  text-align: center;
  border-radius: .5rem;
}

.recipe-title {
  color: rgb(27, 26, 26);
  padding: 10px 15px;
  border-radius: 5px;
  margin-bottom: 15px;
  text-align: center;
}

.recipe-title h2 {
  margin: 0;
  font-size: 20px;
}

.recipe-description {
  background-color: #f6f8fa;
  padding: 20px;
  border-radius: 5px;
  margin-bottom: 20px;
  flex-grow: 1;
  color: #444;
  min-height: 150px;
  border: 1px solid #e0e0e0;
}

.action-buttons {
  display: flex;
  justify-content: space-between;
  gap: 15px;
}

.save-button, .more-button {
  flex: 1;
  padding: 12px 0;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  text-align: center;
  transition: all 0.2s ease;
}

.save-button {
  background-color: rgb(211, 234, 209);
  color: #347944;
}
.more-button {
  background-color:rgb(204, 205, 209);
  color: #383D41;
}


/* Loading animation */
.loading-container {
  text-align: center;
  width: 100%;
  padding: 40px 20px;
}

.loading-container h2 {
  color: #333;
  margin-bottom: 30px;
}

.food-loading-animation {
  position: relative;
  width: 100px;
  height: 100px;
  margin: 0 auto;
}

.plate {
  position: absolute;
  width: 80px;
  height: 16px;
  background-color: #e0e0e0;
  border-radius: 50%;
  bottom: 0;
  left: 10px;
  box-shadow: 0 3px 5px rgba(0,0,0,0.1);
  animation: plate-wobble 1.5s infinite;
}

.fork, .knife {
  position: absolute;
  background-color: #d0d0d0;
  border-radius: 2px;
  animation: utensil-dance 1.5s infinite alternate;
}

.fork {
  width: 5px;
  height: 50px;
  left: 30px;
  bottom: 16px;
  animation-delay: 0.2s;
}

.knife {
  width: 5px;
  height: 50px;
  right: 30px;
  bottom: 16px;
  animation-delay: 0.5s;
}

@keyframes plate-wobble {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

@keyframes utensil-dance {
  0% { transform: translateY(0) rotate(0); }
  25% { transform: translateY(-10px) rotate(5deg); }
  50% { transform: translateY(-15px) rotate(-5deg); }
  75% { transform: translateY(-5px) rotate(5deg); }
  100% { transform: translateY(0) rotate(0); }
}

/* Responsive adjustments */


@media (max-width: 768px) {
  .tutorial-modal-content {
    flex-direction: column;
    padding: 15px;
    width: 95%;
    max-height: 85vh;
    overflow-y: auto; /* Enable scrolling for the entire content */
  }
  
  /* Ensure both sides are visible */
  .tutorial-left-side,
  .tutorial-right-side {
    width: 100%; /* Take full width on mobile */
    max-height: none; /* Remove any height restrictions */
    overflow: visible; /* Don't hide overflow */
    margin-bottom: 20px; /* Add spacing between sections */
    padding:0;
  }
  
  /* Adjust tutorial cards for better mobile display */
  .tutorial-card {
    flex-direction: column;
    margin-bottom: 15px;
  }
  
  
  
  .tutorial-card-img {
    width: 100%; /* Full width of the card */
    min-width: 100%;
    height: auto;
  }
  
  .tutorial-card-img img {
    width: 100%; /* Make the image itself take full width */
    height: auto;
    object-fit: cover;
    border-radius: 8px 8px 0 0; /* Round only top corners */
  }
  
  .tutorial-card-text {
    padding: 10px 5px;
    width: 100%;
  }
  
  /* Make sure all content in right side is visible */
  .recipe-description {
    max-height: none;
    overflow: visible;
  }
}

/* Ensure proper centering on very small devices */
@media (max-width: 480px) {
  .tutorial-modal-content {
    width: 95%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
  .recipe-description {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  color: #444;
  font-size: 14px;
  line-height: 1.6;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  overflow-y:scroll;
}

.nutrition-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.nutrition-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
}

.nutrition-key {
  font-weight: bold;
  color: #333;
  min-width: 150px; /* Adjust based on your content */
}

.nutrition-value {
  color: #666;
  text-align: right;
}

.nutrition-section h4 {
  margin: 0;
  font-size: 16px;
  color: #333;
  border-bottom: 1px solid #ddd;
  padding-bottom: 5px;
}
`;
document.head.appendChild(styleElement);



showPage(1);
