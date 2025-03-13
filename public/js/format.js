// *Date Formating
function extractDate(timestampString) {
  const regex = /\b(\w{3}\s\w{3}\s\d{1,2}\s\d{4})\b/;

  const match = timestampString.match(regex);

  return match ? match[1] : null;
}
//* JavaScript for copying text to clipboard

document.addEventListener("DOMContentLoaded", () => {
  const copyButtons = document.querySelectorAll(".copy");

  copyButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Find the parent .cpyItem element
      const cpyItem = button.closest(".cpyItem");

      if (cpyItem) {
        // Clone the .cpyItem element
        const tempDiv = cpyItem.cloneNode(true);

        // Remove the button from the cloned content
        const buttonToRemove = tempDiv.querySelector("button");
        if (buttonToRemove) {
          tempDiv.removeChild(buttonToRemove);
        }

        // Get the text content, excluding the button
        const textToCopy = tempDiv.textContent.trim();

        console.log("Text to copy:", textToCopy);

        // Copy the text to clipboard
        navigator.clipboard
          .writeText(textToCopy)
          .then(() => {
            console.log("Text copied to clipboard");

            // Update button text to show "Copied!"
            button.textContent = "Copied!";
            setTimeout(() => {
              button.textContent = "Copy";
            }, 2000);
          })
          .catch((err) => {
            console.error("Failed to copy text: ", err);
          });
      } else {
        console.error("No .cpyItem parent found for this button");
      }
    });
  });
});

//**copying the div content
document.addEventListener("DOMContentLoaded", (event) => {
  // Initialize Bootstrap Popovers
  const popoverTriggerList = document.querySelectorAll(
    '[data-bs-toggle="popover"]'
  );
  const popoverList = [...popoverTriggerList].map(
    (popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl)
  );

  document.querySelectorAll(".copy").forEach((button) => {
    button.addEventListener("click", () => {
      const parentDiv = button.parentElement;
      // Get all text content of <p> tags within the parent div
      const textToCopy = Array.from(parentDiv.querySelectorAll("p"))
        .map((pTag) => pTag.textContent.trim())
        .join(" ");

      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          // Show the popover
          const popover = bootstrap.Popover.getInstance(button); // Get the popover instance
          popover.show();

          // Hide the popover after 2 seconds
          setTimeout(() => {
            popover.hide();
          }, 2000);
        })
        .catch((err) => {
          alert("Failed to copy: ", err);
        });
    });
  });
});

const tooltipTriggerList = document.querySelectorAll(
  '[data-bs-toggle="tooltip"]'
);
const tooltipList = [...tooltipTriggerList].map(
  (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
);

const btnSubmit = document.getElementById("btnSubmit");
const btnClose = document.getElementById("btnClose");

btnSubmit.addEventListener("click", (event) => {
  const name = document.getElementById("recipient-name").value;
  const message = document.getElementById("message-text").value;

  fetch("/submit-feedback", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, message }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  document.getElementById("recipient-name").value = "";
  document.getElementById("message-text").value = "";
  btnClose.click();
});

const toastTrigger = document.getElementById("btnSubmit");
const toastLiveExample = document.getElementById("liveToast");

if (toastTrigger) {
  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
  toastTrigger.addEventListener("click", () => {
    toastBootstrap.show();
  });
}

const setting = document.querySelector(".setting");
let touch = 1;
setting.addEventListener("click", () => {
  if (touch) {
    setting.style.transform = "rotate(85deg)";
    touch = 0;
  } else {
    setting.style.transform = "rotate(75deg)";
    touch = 1;
  }
});

function checkWindowSize() {
  const response = document.querySelector(".response");
  const demoItem = document.querySelector(".demoItem");
  const main = document.querySelector(".main");
  const feedback = document.querySelector(".feedback");
  const dropdown = document.querySelector(".dropdown");
  const mainContent = document.getElementById("main-content");
  const warningMessage = document.getElementById("warning-message");
  const name_h = document.getElementById("name-h");
  const botu = document.getElementById("botu");
  const input = document.getElementById("input");
  const btn = document.getElementById("btn");
  const h2ka = document.getElementById("h2ka");
  const h2kaa = document.getElementById("h2kaa");
  const grabber = document.querySelector(".grabber");
  const result = document.getElementById("result");
  const b = document.querySelector(".b");

  // if(window.innerWidth > 1237){
  //     b.style.marginLeft = '7.5rem';
  // }

  if (window.innerWidth < 606) {
    if (grabber) {
      grabber.style.width = "90%";
    }
    if (input) {
      input.style.width = "60vw";
    }
  }
  if (window.innerWidth < 536) {
    if (input) {
      input.style.width = "80vw";
    }
  }
  if (window.innerWidth < 450) {
    if (dropdown) {
      dropdown.style.display = "none";
    }
  }
  if (window.innerWidth < 490) {
    if (name_h) {
      name_h.style.display = "none";
    }
    if (botu) {
      botu.style.fontSize = "1rem";
    }
    if (input) {
      input.style.width = "70vw";
      input.style.height = "7vh";
      input.style.display = "flex";
      input.style.alignItems = "center";
      input.style.justifyContent = "center";
      input.style.justifyContent = "center";
    }
    if (btn) {
      btn.style.width = "45px";
      btn.style.aspectRatio = "1/1";
      btn.style.borderRadius = "50%";
    }
    if (h2ka) {
      h2ka.style.fontSize = "1rem";
    }
    if (h2kaa) {
      h2kaa.style.fontSize = "1rem";
    }
  }
}

window.addEventListener("resize", checkWindowSize);
window.addEventListener("load", checkWindowSize);

const foodArray = [
  "🍕",
  "🍔",
  "🌮",
  "🍩",
  "🍎",
  "🍇",
  "🍓",
  "🍒",
  "🥗",
  "🍣",
  "🍫",
  "🥪",
  "🍳",
  "🍿",
  "🥞",
  "🍖",
  "🧀",
  "🍚",
  "🍥",
  "🍢",
  "🥘",
  "🍧",
  "🧁",
  "🍾",
  "☕",
  "🍨",
  "🍪",
  "🍰",
  "🥐",
  "🍞",
  "🌭",
];

const button = document.getElementById("food-analysis");

button.addEventListener("mouseover", () => {
  const randomIndex = Math.floor(Math.random() * foodArray.length);
  const randomEmoji = foodArray[randomIndex];
  button.innerHTML = `Ananlyze & Share ${randomEmoji}`;
});


document.getElementById('food-analysis').addEventListener('click', function() {
  //*Fetch the markdown file content from the server

      const markdownContent = localStorage.getItem("<RAW_MARKDOWN>");

      //*regex to extract JSON from the markdown content
      const jsonMatchBlock = markdownContent.match(/```json\s*([\s\S]*?)```/);
      const jsonMatchObject = markdownContent.match(/{[^]*}/);  // For standalone JSON

      let nutritionData = null;
      let recipeLink = localStorage.getItem('recipeLink');
      if (jsonMatchBlock && jsonMatchBlock[1]) {
        try {
          const nutritionDataBlock = JSON.parse(jsonMatchBlock[1].trim());
          nutritionData = JSON.parse(jsonMatchBlock[1].trim());

          localStorage.setItem('nutritionAnalysis', JSON.stringify(nutritionDataBlock));

          // console.log('Nutrition data (from code block) extracted and stored:', nutritionDataBlock);
        } catch (error) {
          console.error('Error parsing JSON from code block:', error);
        }
      } else if (jsonMatchObject && jsonMatchObject[0]) {
        try {
          const nutritionDataObject = JSON.parse(jsonMatchObject[0].trim());
          nutritionData = JSON.parse(jsonMatchObject[0].trim());
          localStorage.setItem('nutritionAnalysis', JSON.stringify(nutritionDataObject));

          // console.log('Nutrition data (from object) extracted and stored:', nutritionDataObject);
        } catch (error) {
          console.error('Error parsing standalone JSON:', error);
        }
      } else {
        console.error('No JSON found in markdown');
      }
      if (nutritionData) {
        localStorage.setItem('nutritionAnalysis', JSON.stringify(nutritionData));
        // console.log('Nutrition data extracted and stored:', nutritionData);

        //*popup ko show kr de bruh
        createPopup(nutritionData , recipeLink);
      }

});




function getNutritionData() {
  const storedData = localStorage.getItem('nutritionAnalysis');
  return storedData ? JSON.parse(storedData) : null;
}

function createPopup(nutritionData, recipeLink) {
  // Create main popup container
  const popupContainer = document.createElement('div');
  popupContainer.id = 'popup-container';
  popupContainer.style.display = 'flex';
  popupContainer.style.position = 'fixed';
  popupContainer.style.top = '0';
  popupContainer.style.left = '0';
  popupContainer.style.width = '100vw';
  popupContainer.style.height = '100vh';
  popupContainer.style.justifyContent = 'center';
  popupContainer.style.alignItems = 'center';
  popupContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  popupContainer.style.zIndex = '1000';
  popupContainer.style.backdropFilter = 'blur(5px)';
  popupContainer.style.transition = 'all 0.3s ease-in-out';
  popupContainer.style.fontFamily = 'sans-serif'; // Apply the Lato font


  // Create popup card
  const popupCard = document.createElement('div');
  popupCard.style.width = '90%';
  popupCard.style.maxWidth = '800px';
  popupCard.style.backgroundColor = '#ffffff';
  popupCard.style.borderRadius = '16px';
  popupCard.style.padding = '25px';
  popupCard.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.3)';
  popupCard.style.overflowY = 'auto';
  popupCard.style.maxHeight = '85vh';
  popupCard.style.textAlign = 'left';
  popupCard.style.animation = 'fadeIn 0.3s ease-out';
  popupCard.style.position = 'relative';

  // Add CSS animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @media print {
      body * {
        visibility: hidden;
      }
      #popup-container, #popup-container * {
        visibility: visible;
      }
      #popup-container {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: white;
        font-family:"sans-serif !important";
      }
      .no-print {
        display: none !important;
      }
    }
  `;
  document.head.appendChild(style);

  // Create close button
  const closeButton = document.createElement('button');
  closeButton.className = 'no-print';
  closeButton.innerHTML = '❌';
  closeButton.style.position = 'absolute';
  closeButton.style.top = '15px';
  closeButton.style.right = '15px';
  closeButton.style.background = 'none';
  closeButton.style.border = 'none';
  closeButton.style.fontSize = '28px';
  closeButton.style.fontWeight = 'bold';
  closeButton.style.cursor = 'pointer';
  closeButton.style.color = '#ff5252';
  closeButton.style.transition = 'color 0.2s ease';
  closeButton.style.width = '40px';
  closeButton.style.height = '40px';
  closeButton.style.borderRadius = '50%';
  closeButton.style.display = 'flex';
  closeButton.style.justifyContent = 'center';
  closeButton.style.alignItems = 'center';
  closeButton.addEventListener('mouseover', function() {
    closeButton.style.backgroundColor = '#f8f8f8';
  });
  closeButton.addEventListener('mouseout', function() {
    closeButton.style.backgroundColor = 'transparent';
  });
  closeButton.addEventListener('click', function() {
    // Add fade out animation
    popupContainer.style.opacity = '0';
    setTimeout(() => {
      popupContainer.remove();
    }, 300);
  });

  // Add content to popup
  const content = document.createElement('div');
  content.style.lineHeight = '1.6';
  content.style.color = '#333';
  content.style.marginTop = '10px';


  function renderNestedObject(obj) {
    if (!obj) return '';

    let html = '';
    if (typeof obj === 'object') {
      Object.entries(obj).forEach(([key, value]) => {
        if (value === null || value === undefined) return;

        if (typeof value === 'object') {
          if (value.amount && value.percent_dv) {
            html += `
              <li>
                <strong>${key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong> 
                ${value.amount} <span class="percent-badge">${value.percent_dv} DV</span>
              </li>
            `;
          } else {
            html += `
              <li>
                <strong>${key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong>
                <ul class="nested-list">${renderNestedObject(value)}</ul>
              </li>
            `;
          }
        } else {
          html += `
            <li>
              <strong>${key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong> 
              ${value}
            </li>
          `;
        }
      });
    }
    return html;
  }

  // Add CSS for better styling
  const contentStyle = document.createElement('style');
  contentStyle.textContent = `
    *{
      font-family: "sans-serif" !important;
  }
    .nutrition-section {
      padding: 18px;
      border-radius: 12px;
      margin-bottom: 20px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.05);
      transition: transform 0.2s ease;
    }
    .nutrition-section:hover {
      transform: translateY(-3px);
    }
    .nutrition-section h3 {
      margin-top: 0;
      margin-bottom: 15px;
      font-size: 20px;
      font-weight: 600;
      font-family: "sans-serif" !important;
    }
    ul.nested-list {
      padding-left: 20px;
    }
    .percent-badge {
      display: inline-block;
      background-color: #f0f0f0;
      padding: 2px 6px;
      border-radius: 12px;
      font-size: 0.85em;
      margin-left: 5px;
      color: #555;
    }
    .nutrition-section ul {
      padding-left: 5px;
      list-style: none;
    }
    .nutrition-section li {
      padding: 5px 0;
      border-bottom: 1px solid rgba(0,0,0,0.05);
    }
    .nutrition-section li:last-child {
      border-bottom: none;
    }
  `;
  document.head.appendChild(contentStyle);

  content.innerHTML = `
    <h2 style="text-align: center; color: #2c3e50; font-size: 28px; margin-bottom: 25px; font-weight: 700;>Comprehensive Nutrition Analysis</h2>
    
    ${nutritionData.calories ? `
      <div class="nutrition-section" style="background: #f7fbfc; border-left: 5px solid #4caf50;">
        <h3 style="color: #4caf50;">Calories</h3>
        <p style="font-size: 22px; font-weight: 500;">${nutritionData.calories}</p>
      </div>
    ` : ''}

    ${nutritionData.macronutrients ? `
      <div class="nutrition-section" style="background: #fff3e0; border-left: 5px solid #ff9800;">
        <h3 style="color: #ff9800;">Macronutrients</h3>
        <ul>
          ${renderNestedObject(nutritionData.macronutrients)}
        </ul>
      </div>
    ` : ''}

    ${nutritionData.micronutrients ? `
      <div class="nutrition-section" style="background: #f3e5f5; border-left: 5px solid #9c27b0;">
        <h3 style="color: #9c27b0;">Micronutrients</h3>
        <ul>
          ${nutritionData.micronutrients.minerals ? renderNestedObject(nutritionData.micronutrients.minerals) : ''}
          ${nutritionData.micronutrients.vitamins ? `
            <li><strong>Vitamins:</strong> ${nutritionData.micronutrients.vitamins}</li>
          ` : ''}
        </ul>
      </div>
    ` : ''}

    ${nutritionData.dietary_fiber ? `
      <div class="nutrition-section" style="background: #e8f5e9; border-left: 5px solid #2e7d32;">
        <h3 style="color: #2e7d32;">Dietary Components</h3>
        <ul>
          <li><strong>Dietary Fiber:</strong> ${nutritionData.dietary_fiber.amount} <span class="percent-badge">${nutritionData.dietary_fiber.percent_dv} DV</span></li>
          <li><strong>Cholesterol:</strong> ${nutritionData.cholesterol.amount} <span class="percent-badge">${nutritionData.cholesterol.percent_dv} DV</span></li>
          <li><strong>Sodium:</strong> ${nutritionData.sodium.amount} <span class="percent-badge">${nutritionData.sodium.percent_dv} DV</span></li>
        </ul>
      </div>
    ` : ''}

    ${nutritionData.other_components ? `
      <div class="nutrition-section" style="background: #e3f2fd; border-left: 5px solid #1976d2;">
        <h3 style="color: #1976d2;">Other Components</h3>
        <ul>
          ${renderNestedObject(nutritionData.other_components)}
        </ul>
      </div>
    ` : ''}

    ${nutritionData.health_effects ? `
      <div class="nutrition-section" style="background: #fff8e1; border-left: 5px solid #ffa000;">
        <h3 style="color: #ffa000;">Health Effects</h3>
        <p>${nutritionData.health_effects}</p>
      </div>
    ` : ''}
  `;

  // Create button container
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'no-print';
  buttonContainer.style.display = 'flex';
  buttonContainer.style.justifyContent = 'center';
  buttonContainer.style.marginTop = '30px';
  buttonContainer.style.gap = '15px';

  // Create print button
  const visualizeButton = document.createElement('button');
  visualizeButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style="margin-right: 8px;"><path d="M1 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V2zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V2zM1 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V7zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V7zM1 12a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-2zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-2zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2z"/></svg>Visualize';
  visualizeButton.style.padding = '12px 24px';
  visualizeButton.style.border = 'none';
  visualizeButton.style.borderRadius = '8px';
  visualizeButton.style.backgroundColor = '#E3F2FD';
  visualizeButton.style.color = '#1976D2';
  visualizeButton.style.cursor = 'pointer';
  visualizeButton.style.fontWeight = '600';
  visualizeButton.style.display = 'flex';
  visualizeButton.style.alignItems = 'center';
  visualizeButton.style.justifyContent = 'center';
  visualizeButton.style.transition = 'background-color 0.2s ease';
  visualizeButton.addEventListener('mouseover', function() {
      visualizeButton.style.backgroundColor = '#0069d9';
      visualizeButton.style.color = '#fff';
  });
  visualizeButton.addEventListener('mouseout', function() {
      visualizeButton.style.backgroundColor = '#E3F2FD';
      visualizeButton.style.color = '#1976D2';
  });
  visualizeButton.addEventListener('click', function() {
      showNutritionChart(nutritionData);
  });

  // Create share button
  const shareButton = document.createElement('button');
  shareButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style="margin-right: 8px;"><path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5z"/></svg>Share';
  shareButton.style.padding = '12px 24px';
  shareButton.style.border = 'none';
  shareButton.style.borderRadius = '8px';
  shareButton.style.backgroundColor = '#E8F5E9';
  shareButton.style.color = '#2E7D32';
  shareButton.style.cursor = 'pointer';
  shareButton.style.fontWeight = '600';
  shareButton.style.display = 'flex';
  shareButton.style.alignItems = 'center';
  shareButton.style.justifyContent = 'center';
  shareButton.style.transition = 'background-color 0.2s ease';
  shareButton.addEventListener('mouseover', function() {
    shareButton.style.backgroundColor = '#218838';
    shareButton.style.color = '#fff';
  });
  shareButton.addEventListener('mouseout', function() {
    shareButton.style.backgroundColor = '#E8F5E9';
    shareButton.style.color = '#2E7D32';
  });
  shareButton.addEventListener('click', function() {
    showSharePopup(recipeLink);
  });

  // Add elements to the DOM
  buttonContainer.appendChild(visualizeButton);
  buttonContainer.appendChild(shareButton);
  popupCard.appendChild(closeButton);
  popupCard.appendChild(content);
  popupCard.appendChild(buttonContainer);
  popupContainer.appendChild(popupCard);
  document.body.appendChild(popupContainer);
}

function showNutritionChart(nutritionData) {
  // Create overlay
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  overlay.style.zIndex = '1100';
  overlay.style.backdropFilter = 'blur(3px)';

  // Create chart container
  const chartContainer = document.createElement('div');
  chartContainer.style.position = 'fixed';
  chartContainer.style.top = '50%';
  chartContainer.style.left = '50%';
  chartContainer.style.transform = 'translate(-50%, -50%)';
  chartContainer.style.background = '#fff';
  chartContainer.style.padding = '25px';
  chartContainer.style.borderRadius = '12px';
  chartContainer.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.25)';
  chartContainer.style.zIndex = '1101';
  chartContainer.style.width = '90%';
  chartContainer.style.maxWidth = '800px';
  chartContainer.style.maxHeight = '90vh';
  chartContainer.style.overflow = 'auto';

  // Create close button
  const closeChart = document.createElement('button');
  closeChart.innerHTML = '⛌';
  closeChart.style.position = 'absolute';
  closeChart.style.top = '10px';
  closeChart.style.right = '10px';
  closeChart.style.background = 'none';
  closeChart.style.border = 'none';
  closeChart.style.fontSize = '24px';
  closeChart.style.cursor = 'pointer';
  closeChart.style.color = '#888';
  closeChart.addEventListener('click', function() {
      overlay.remove();
  });

  // Create canvas for chart
  const canvas = document.createElement('canvas');
  canvas.id = 'nutritionChart';

  // Function to extract numeric value from string
  const extractNumber = (str) => {
      if (!str) return 0;
      const match = str.match(/(\d*\.?\d+)/);
      return match ? parseFloat(match[0]) : 0;
  };

  // Prepare chart data
  const macronutrients = nutritionData.macronutrients || {};
  const chartData = {
      labels: ['Protein', 'Fat', 'Carbohydrates', 'Sugar', 'Fiber'],
      datasets: [{
          label: 'Nutrients (g)',
          data: [
              extractNumber(macronutrients.protein?.amount),
              extractNumber(macronutrients.fat?.amount),
              extractNumber(macronutrients.carbohydrates?.amount),
              extractNumber(macronutrients.sugar?.amount),
              extractNumber(nutritionData.dietary_fiber?.amount)
          ],
          backgroundColor: [
              'rgba(75, 192, 192, 0.6)',  // Protein
              'rgba(255, 99, 132, 0.6)',  // Fat
              'rgba(54, 162, 235, 0.6)',  // Carbohydrates
              'rgba(255, 206, 86, 0.6)',  // Sugar
              'rgba(153, 102, 255, 0.6)'  // Fiber
          ],
          borderColor: [
              'rgba(75, 192, 192, 1)',
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(153, 102, 255, 1)'
          ],
          borderWidth: 1
      }]
  };

  // Add elements to container
  chartContainer.appendChild(closeChart);
  chartContainer.appendChild(canvas);
  overlay.appendChild(chartContainer);
  document.body.appendChild(overlay);

  // Create chart
  const ctx = canvas.getContext('2d');
  new Chart(ctx, {
      type: 'bar',
      data: chartData,
      options: {
          responsive: true,
          plugins: {
              legend: {
                  position: 'top',
              },
              title: {
                  display: true,
                  text: 'Nutrition Breakdown (Grams)'
              },
              tooltip: {
                  callbacks: {
                      label: function(context) {
                          let label = context.dataset.label || '';
                          if (label) {
                              label += ': ';
                          }
                          label += context.parsed.y + 'g';
                          return label;
                      }
                  }
              }
          },
          scales: {
              y: {
                  beginAtZero: true,
                  title: {
                      display: true,
                      text: 'Amount (grams)'
                  }
              }
          }
      }
  });

  // Close when clicking outside
  overlay.addEventListener('click', function(e) {
      if (e.target === overlay) {
          overlay.remove();
      }
  });
}

function showSharePopup(recipeLink) {
  // Create overlay for click-outside-to-close
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  overlay.style.zIndex = '1100';
  overlay.style.backdropFilter = 'blur(3px)';

  // Create share popup
  const sharePopup = document.createElement('div');
  sharePopup.style.position = 'fixed';
  sharePopup.style.top = '50%';
  sharePopup.style.left = '50%';
  sharePopup.style.transform = 'translate(-50%, -50%)';
  sharePopup.style.background = '#fff';
  sharePopup.style.padding = '25px';
  sharePopup.style.borderRadius = '12px';
  sharePopup.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.25)';
  sharePopup.style.textAlign = 'center';
  sharePopup.style.zIndex = '1101';
  sharePopup.style.minWidth = '300px';
  sharePopup.style.maxWidth = '400px';
  sharePopup.style.animation = 'scaleIn 0.2s ease-out';

  // Add animation
  const shareStyle = document.createElement('style');
  shareStyle.textContent = `
    @keyframes scaleIn {
      from { transform: translate(-50%, -50%) scale(0.9); opacity: 0; }
      to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    }
  `;
  document.head.appendChild(shareStyle);

  // Add title
  const title = document.createElement('h3');
  title.textContent = 'Share Recipe Link';
  title.style.margin = '0 0 20px 0';
  title.style.color = '#333';
  title.style.fontWeight = '600';

  // Add input box
  const inputContainer = document.createElement('div');
  inputContainer.style.position = 'relative';
  inputContainer.style.marginBottom = '20px';

  const inputBox = document.createElement('input');
  inputBox.type = 'text';
  inputBox.value = recipeLink;
  inputBox.readOnly = true;
  inputBox.style.width = '100%';
  inputBox.style.padding = '12px 15px';
  inputBox.style.marginBottom = '5px';
  inputBox.style.border = '2px solid #e0e0e0';
  inputBox.style.borderRadius = '8px';
  inputBox.style.fontSize = '14px';
  inputBox.style.boxSizing = 'border-box';
  inputBox.style.color = '#555';
  inputBox.style.backgroundColor = '#f8f8f8';

  // Add copy button
  const copyButton = document.createElement('button');
  copyButton.innerText = 'Copy Link';
  copyButton.style.padding = '12px 20px';
  copyButton.style.border = 'none';
  copyButton.style.borderRadius = '8px';
  copyButton.style.backgroundColor = '#007bff';
  copyButton.style.color = '#fff';
  copyButton.style.cursor = 'pointer';
  copyButton.style.fontSize = '15px';
  copyButton.style.fontWeight = '600';
  copyButton.style.transition = 'all 0.2s ease';
  copyButton.style.width = '100%';
  copyButton.addEventListener('mouseover', function() {
    copyButton.style.backgroundColor = '#0069d9';
  });
  copyButton.addEventListener('mouseout', function() {
    copyButton.style.backgroundColor = '#007bff';
  });
  copyButton.addEventListener('click', function() {
    inputBox.select();
    document.execCommand('copy');
    copyButton.style.backgroundColor = '#28a745';
    copyButton.innerText = 'Copied!';
    
    // Reset button after 2 seconds
    setTimeout(() => {
      copyButton.style.backgroundColor = '#007bff';
      copyButton.innerText = 'Copy Link';
    }, 2000);
  });

  // Add close button
  const closeShare = document.createElement('button');
  closeShare.innerHTML = '&times;';
  closeShare.style.position = 'absolute';
  closeShare.style.top = '10px';
  closeShare.style.right = '10px';
  closeShare.style.background = 'none';
  closeShare.style.border = 'none';
  closeShare.style.fontSize = '24px';
  closeShare.style.cursor = 'pointer';
  closeShare.style.color = '#888';
  closeShare.style.width = '30px';
  closeShare.style.height = '30px';
  closeShare.style.display = 'flex';
  closeShare.style.justifyContent = 'center';
  closeShare.style.alignItems = 'center';
  closeShare.style.borderRadius = '50%';
  closeShare.style.transition = 'background 0.2s ease';
  
  closeShare.addEventListener('mouseover', function() {
    closeShare.style.backgroundColor = '#f0f0f0';
  });
  closeShare.addEventListener('mouseout', function() {
    closeShare.style.backgroundColor = 'transparent';
  });
  closeShare.addEventListener('click', function() {
    overlay.remove();
  });

  // Add elements to share popup
  sharePopup.appendChild(closeShare);
  sharePopup.appendChild(title);
  inputContainer.appendChild(inputBox);
  sharePopup.appendChild(inputContainer);
  sharePopup.appendChild(copyButton);
  
  // Close popup when clicking outside
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) {
      overlay.remove();
    }
  });

  // Add to DOM
  overlay.appendChild(sharePopup);
  document.body.appendChild(overlay);
  
  // Focus and select the link text for easy copying
  setTimeout(() => {
    inputBox.focus();
    inputBox.select();
  }, 100);
}
