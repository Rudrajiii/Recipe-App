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
  button.innerHTML = `Analyze ${randomEmoji}`;
});

document.getElementById('food-analysis').addEventListener('click', function() {
  //*Fetch the markdown file content from the server
  fetch('/get-markdown')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch markdown file');
      }
      return response.text();
    })
    .then(markdownContent => {
      //*regex to extract JSON from the markdown content
      const jsonMatchBlock = markdownContent.match(/```json\s*([\s\S]*?)```/);
      const jsonMatchObject = markdownContent.match(/{[^]*}/);  // For standalone JSON

      let nutritionData = null;

      if (jsonMatchBlock && jsonMatchBlock[1]) {
        try {
          const nutritionDataBlock = JSON.parse(jsonMatchBlock[1].trim());
          nutritionData = JSON.parse(jsonMatchBlock[1].trim());

          localStorage.setItem('nutritionAnalysis', JSON.stringify(nutritionDataBlock));

          console.log('Nutrition data (from code block) extracted and stored:', nutritionDataBlock);
        } catch (error) {
          console.error('Error parsing JSON from code block:', error);
        }
      } else if (jsonMatchObject && jsonMatchObject[0]) {
        try {
          const nutritionDataObject = JSON.parse(jsonMatchObject[0].trim());
          nutritionData = JSON.parse(jsonMatchObject[0].trim());
          localStorage.setItem('nutritionAnalysis', JSON.stringify(nutritionDataObject));

          console.log('Nutrition data (from object) extracted and stored:', nutritionDataObject);
        } catch (error) {
          console.error('Error parsing standalone JSON:', error);
        }
      } else {
        console.error('No JSON found in markdown');
      }
      if (nutritionData) {
        localStorage.setItem('nutritionAnalysis', JSON.stringify(nutritionData));
        console.log('Nutrition data extracted and stored:', nutritionData);

        //*popup ko show kr de bruh
        createPopup(nutritionData);
      }
    })
    .catch(error => {
      console.error('Error fetching markdown file:', error);
    });
});


function getNutritionData() {
  const storedData = localStorage.getItem('nutritionAnalysis');
  return storedData ? JSON.parse(storedData) : null;
}

function createPopup(nutritionData) {
  const popupContainer = document.getElementById('popup-container');
  popupContainer.style.display = 'flex';
  popupContainer.style.position = 'fixed';
  popupContainer.style.top = '0';
  popupContainer.style.left = '0';
  popupContainer.style.width = '100vw';
  popupContainer.style.height = '100vh';
  popupContainer.style.justifyContent = 'center';
  popupContainer.style.alignItems = 'center';
  popupContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
  popupContainer.style.zIndex = '1000';

  const popupCard = document.createElement('div');
  popupCard.style.width = '90%';
  popupCard.style.maxWidth = '800px';
  popupCard.style.backgroundColor = '#ffffff';
  popupCard.style.borderRadius = '12px';
  popupCard.style.padding = '20px';
  popupCard.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
  popupCard.style.overflowY = 'auto';
  popupCard.style.maxHeight = '90vh';
  popupCard.style.fontFamily = '"Roboto", Arial, sans-serif';
  popupCard.style.textAlign = 'left';

  const closeButton = document.createElement('button');
  closeButton.innerText = '❌';
  closeButton.style.float = 'right';
  closeButton.style.background = 'none';
  closeButton.style.border = 'none';
  closeButton.style.fontSize = '24px';
  closeButton.style.cursor = 'pointer';
  closeButton.style.color = '#ff5252';
  closeButton.addEventListener('click', function () {
    popupContainer.style.display = 'none';
    popupContainer.innerHTML = '';
  });

  popupCard.appendChild(closeButton);

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
                ${value.amount} (${value.percent_dv} DV)
              </li>
            `;
          } else {
            html += `
              <li>
                <strong>${key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong>
                <ul>${renderNestedObject(value)}</ul>
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

  const content = document.createElement('div');
  content.style.lineHeight = '1.6';
  content.style.color = '#333';

  content.innerHTML = `
    <h2 style="text-align: center; color: #2c3e50; font-size: 24px; margin-bottom: 20px;">Comprehensive Nutrition Analysis</h2>
    
    ${nutritionData.calories ? `
      <div style="background: #f7fbfc; padding: 15px; border-left: 5px solid #4caf50; border-radius: 8px; margin-bottom: 15px;">
        <h3 style="color: #4caf50; margin-bottom: 10px;">Calories</h3>
        <p style="font-size: 18px;">${nutritionData.calories} kcal</p>
      </div>
    ` : ''}

    ${nutritionData.macronutrients ? `
      <div style="background: #fff3e0; padding: 15px; border-left: 5px solid #ff9800; border-radius: 8px; margin-bottom: 15px;">
        <h3 style="color: #ff9800; margin-bottom: 10px;">Macronutrients</h3>
        <ul style="padding: 0; list-style: none; margin: 0;">
          ${renderNestedObject(nutritionData.macronutrients)}
        </ul>
      </div>
    ` : ''}

    ${nutritionData.micronutrients ? `
      <div style="background: #f3e5f5; padding: 15px; border-left: 5px solid #9c27b0; border-radius: 8px; margin-bottom: 15px;">
        <h3 style="color: #9c27b0; margin-bottom: 10px;">Micronutrients</h3>
        <ul style="padding: 0; list-style: none; margin: 0;">
          ${nutritionData.micronutrients.minerals ? renderNestedObject(nutritionData.micronutrients.minerals) : ''}
          ${nutritionData.micronutrients.vitamins ? `
            <li><strong>Vitamins:</strong> ${nutritionData.micronutrients.vitamins}</li>
          ` : ''}
        </ul>
      </div>
    ` : ''}

    ${nutritionData.dietary_fiber ? `
      <div style="background: #e8f5e9; padding: 15px; border-left: 5px solid #2e7d32; border-radius: 8px; margin-bottom: 15px;">
        <h3 style="color: #2e7d32; margin-bottom: 10px;">Dietary Components</h3>
        <ul style="padding: 0; list-style: none; margin: 0;">
          <li><strong>Dietary Fiber:</strong> ${nutritionData.dietary_fiber.amount} (${nutritionData.dietary_fiber.percent_dv} DV)</li>
          <li><strong>Cholesterol:</strong> ${nutritionData.cholesterol.amount} (${nutritionData.cholesterol.percent_dv} DV)</li>
          <li><strong>Sodium:</strong> ${nutritionData.sodium.amount} (${nutritionData.sodium.percent_dv} DV)</li>
        </ul>
      </div>
    ` : ''}

    ${nutritionData.other_components ? `
      <div style="background: #e3f2fd; padding: 15px; border-left: 5px solid #1976d2; border-radius: 8px; margin-bottom: 15px;">
        <h3 style="color: #1976d2; margin-bottom: 10px;">Other Components</h3>
        <ul style="padding: 0; list-style: none; margin: 0;">
          ${renderNestedObject(nutritionData.other_components)}
        </ul>
      </div>
    ` : ''}

    ${nutritionData.health_effects ? `
      <div style="background: #fff8e1; padding: 15px; border-left: 5px solid #ffa000; border-radius: 8px; margin-bottom: 15px;">
        <h3 style="color: #ffa000; margin-bottom: 10px;">Health Effects</h3>
        <p>${nutritionData.health_effects}</p>
      </div>
    ` : ''}
  `;

  popupCard.appendChild(content);
  popupContainer.appendChild(popupCard);
}
