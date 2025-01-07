# Beekeeper

Beekeeper is a tool designed to help users solve and track their progress in the New York Times Spelling Bee game. The project provides a user-friendly interface to visualize the grid of answers and the two-letter list, making it easier to see what's left to find.

## Technologies Used

This project was built using the following tools and technologies:

- **Node.js**: The backend server is built with Node.js to handle requests and serve the front-end.
- **Express**: Express.js is used for routing and handling API endpoints.
- **Puppeteer**: Puppeteer is used to scrape the Spelling Bee answers from the web.
- **HTML/CSS/JavaScript**: The front-end interface is built using standard web technologies (HTML for structure, CSS for styling, JavaScript for functionality).
- **Bootstrap**: Bootstrap is used for responsive layout and styling of the user interface.

## Installation

Follow these steps to set up the project on your local machine:

1. Clone the repository:

    ```bash
    git clone https://github.com/jcksnm/Beekeeper.git
    ```

2. Navigate to the project directory:

    ```bash
    cd Beekeeper
    ```

3. Install the required dependencies:

    ```bash
    npm install
    ```

4. Start the server:

    ```bash
    node server.js
    ```

5. Open your browser and navigate to:

    ```bash
    http://localhost:3000
    ```

## How to Use

1. Once the site is loaded in your browser, you will see an input area where you can paste your Spelling Bee answers.

2. Click the “Update” button to update the grid and two-letter list based on your inputs.

3. The grid will display the remaining answers you need to find, and the two-letter list will update to reflect the counts of two-letter combinations still unsolved.

4. You can continue updating the site by pasting your current answers whenever you want to see your progress.

<br>
Enjoy solving the puzzle with Beekeeper!  