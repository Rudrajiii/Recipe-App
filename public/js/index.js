document.getElementById('btn').addEventListener('click', async () => {
    try {

        const userInput = document.getElementById('input').value;

        // Fetch data from API with user input as prompt

        const response = await fetch(`/api?prompt=${encodeURIComponent(userInput)}`);
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
    } catch (error) {

        console.error('There was a problem with the fetch operation:', error);

    }

});

