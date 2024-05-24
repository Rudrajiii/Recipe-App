
const btn = document.getElementById("btn");
const progressBar = document.getElementById("progressBar");

// Function to show the loading animation
function showLoadingAnimation() {
    progressBar.style.display = "block";
}

// Function to hide the loading animation
function hideLoadingAnimation() {
    progressBar.style.display = "none";
}
document.getElementById('btn').addEventListener('click', async () => {
    try {

        
        const userInput = document.getElementById('input').value;

        showLoadingAnimation(); 
        // console.log(userInput);
        const startTime = performance.now();

        // Fetch data from API with user input as prompt

        const response = await fetch(`/api?prompt=${encodeURIComponent(userInput)}`);

        // End time after receiving the response
        const endTime = performance.now();

        // Calculate delay time
        const delayTime = endTime - startTime;
        if (!response.ok) {

            throw new Error('Network response was not ok');

        }
        const data = await response.json();

        // Update the UI with the received data

        const formattedResponse = data.response.split('\n').map(line => document.createTextNode(line));

        document.getElementById('result').textContent = ''; // Clear previous content

        formattedResponse.forEach(node => {

            document.getElementById('result').appendChild(node);

            document.getElementById('result').appendChild(document.createElement('br'));

        });

        document.getElementById('input').value = '';
        console.log(delayTime / 60);
        
    } catch (error) {

        console.error('There was a problem with the fetch operation:', error);

    } finally{
        hideLoadingAnimation()
        
    }

});

// Listen for "Enter" key press on the input field
document.getElementById('input').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent default form submission
        document.getElementById('btn').click(); // Trigger click event on the generate button
    }
});
