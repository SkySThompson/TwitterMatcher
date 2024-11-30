// script.js

let users = [];
const apiLimit = 17; // Twitter free plan: 17 requests/day

document.getElementById('userForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const usernameInput = document.getElementById('username');
    const username = usernameInput.value.trim();
    if (username && !users.includes(username)) {
        users.push(username);
        updateUserList();
        document.getElementById('analyzeBtn').disabled = users.length < 2;
    }
    usernameInput.value = '';
});

document.getElementById('analyzeBtn').addEventListener('click', analyzeVibes);

function updateUserList() {
    const userList = document.getElementById('userList');
    userList.innerHTML = '';
    users.forEach((user, index) => {
        const li = document.createElement('li');
        li.textContent = user;
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.style.marginLeft = '10px';
        removeBtn.addEventListener('click', () => {
            users.splice(index, 1);
            updateUserList();
            document.getElementById('analyzeBtn').disabled = users.length < 2;
        });
        li.appendChild(removeBtn);
        userList.appendChild(li);
    });
}

async function analyzeVibes() {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<p>Analyzing...</p>';

    try {
        const themes = {};

        for (const user of users) {
            // Fake API call placeholder
            const tweets = await fetchUserTweets(user);
            const keywords = extractKeywords(tweets);

            keywords.forEach((keyword) => {
                if (!themes[keyword]) themes[keyword] = [];
                themes[keyword].push(user);
            });
        }

        displayResults(themes);
    } catch (error) {
        resultsDiv.innerHTML = `<p>Error: ${error.message}</p>`;
    }
}

// Mock function for fetching tweets (replace with Twitter API call)
async function fetchUserTweets(username) {
    return new Promise((resolve) =>
        setTimeout(() => resolve([
            `${username}'s favorite game is Minecraft.`,
            `${username} loves coding in Python.`,
            `${username} recently visited the mountains.`,
        ]), 500)
    );
}

// Keyword extractor
function extractKeywords(tweets) {
    const words = tweets.join(' ').toLowerCase().split(/\W+/);
    const commonWords = ['the', 'is', 'in', 'and', 'of', 'to', 'a', 'loves', 'recently', 'favorite'];
    return words.filter((word) => word.length > 3 && !commonWords.includes(word));
}

// Display shared themes
function displayResults(themes) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<h3>Team Vibes:</h3>';
    const ul = document.createElement('ul');

    Object.entries(themes).forEach(([keyword, users]) => {
        if (users.length > 1) {
            const li = document.createElement('li');
            li.textContent = `${keyword}: Shared by ${users.join(', ')}`;
            ul.appendChild(li);
        }
    });

    resultsDiv.appendChild(ul);
}
