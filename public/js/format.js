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