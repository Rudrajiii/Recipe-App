

//*Date Formating
function extractDate(timestampString) {
    const regex = /\b(\w{3}\s\w{3}\s\d{1,2}\s\d{4})\b/;
    
    const match = timestampString.match(regex);
    
    return match ? match[1] : null;
}
//* JavaScript for copying text to clipboard
 const copyButtons = document.querySelectorAll('.copy-button');
    
copyButtons.forEach(button => {
     button.addEventListener('click', () => {
         const index = button.getAttribute('data-index');
         const historyItem = document.getElementById(`history${index}`);
         const textToCopy = historyItem.innerText;
         const textarea = document.createElement('textarea');
         textarea.value = textToCopy;
         textarea.setAttribute('readonly', '');
         textarea.style.position = 'absolute';
         textarea.style.left = '-9999px';
         document.body.appendChild(textarea);
         textarea.select();
         document.execCommand('copy');
         document.body.removeChild(textarea);
         button.textContent = 'Copied!';
         setTimeout(() => {
             button.textContent = 'Copy';
         }, 2000);
     });
 });


//**copying the div content
document.addEventListener('DOMContentLoaded', (event) => {
    // Initialize Bootstrap Popovers
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
    const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));

    document.querySelectorAll('.copy').forEach(button => {
        button.addEventListener('click', () => {
            const parentDiv = button.parentElement;
            // Get all text content of <p> tags within the parent div
            const textToCopy = Array.from(parentDiv.querySelectorAll('p'))
                .map(pTag => pTag.textContent.trim())
                .join(' ');

            navigator.clipboard.writeText(textToCopy).then(() => {
                // Show the popover
                const popover = bootstrap.Popover.getInstance(button); // Get the popover instance
                popover.show();

                // Hide the popover after 2 seconds
                setTimeout(() => {
                    popover.hide();
                }, 2000);
            }).catch(err => {
                alert('Failed to copy: ', err);
            });
        });
    });
});


const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

const btnSubmit = document.getElementById('btnSubmit');
const btnClose = document.getElementById('btnClose');

btnSubmit.addEventListener('click', (event) => {
    const name = document.getElementById('recipient-name').value;
    const message = document.getElementById('message-text').value;

    fetch('/submit-feedback', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, message }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
    document.getElementById('recipient-name').value = '';
    document.getElementById('message-text').value = '';
    btnClose.click();
});

const toastTrigger = document.getElementById('btnSubmit')
const toastLiveExample = document.getElementById('liveToast')

if (toastTrigger) {
  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
  toastTrigger.addEventListener('click', () => {
    toastBootstrap.show()
  })
}

const setting = document.querySelector(".setting");
let touch = 1;
setting.addEventListener("click", () => {
    if(touch){
        setting.style.transform = "rotate(85deg)";
        touch = 0;
    }else{
        setting.style.transform = "rotate(75deg)";
        touch = 1;
    }
})

function checkWindowSize(){
    const response = document.querySelector('.response');
    const demoItem = document.querySelector('.demoItem');
    const main = document.querySelector('.main');
    const feedback = document.querySelector('.feedback');
    const dropdown = document.querySelector('.dropdown');
    const mainContent = document.getElementById('main-content');
    const warningMessage = document.getElementById('warning-message');
    const name_h = document.getElementById('name-h');
    const botu = document.getElementById('botu');
    const input = document.getElementById('input');
    const btn = document.getElementById('btn');
    const h2ka = document.getElementById('h2ka');
    const h2kaa = document.getElementById('h2kaa');
    const grabber = document.querySelector('.grabber');
    const result = document.getElementById('result');
    const b = document.querySelector('.b');


    // if(window.innerWidth > 1237){
    //     b.style.marginLeft = '7.5rem';
    // }


    if (window.innerWidth < 606) {
        if(grabber){
            grabber.style.width = '90%';
        }
        if(input){
            input.style.width = '60vw';
        }
    }
    if(window.innerWidth < 536){
        if(input){
            input.style.width = '80vw';
        }
    } 
    if(window.innerWidth < 450){
        if(dropdown){
            dropdown.style.display = 'none';
        }
    }
    if(window.innerWidth < 490){
        if(name_h){
            name_h.style.display = 'none';
        }
        if(botu){
            botu.style.fontSize = '1rem';
        }
        if(input){
            input.style.width = '70vw';
            input.style.height = '7vh';
            input.style.display = 'flex';
            input.style.alignItems = 'center';
            input.style.justifyContent = 'center';
            input.style.justifyContent = 'center';
        }
        if(btn){
            btn.style.width = '45px';
            btn.style.aspectRatio = '1/1';
            btn.style.borderRadius = '50%'
        }
        if(h2ka){
            h2ka.style.fontSize = '1rem';
        }
        if(h2kaa){
            h2kaa.style.fontSize = '1rem';
        }
    }
    
}

window.addEventListener('resize', checkWindowSize);
window.addEventListener('load', checkWindowSize);