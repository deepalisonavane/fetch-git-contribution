const express = require('express');
const axios = require('axios');
const ejs = require('ejs');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
const path = require('path');



const githubUsername = 'deepalisonavane';

 const getContributionsAndRepositories = async ()=> {
    try {
        // Fetch events from the GitHub profile
        const eventsResponse = await axios.get(`https://api.github.com/users/${githubUsername}/events`);
        const events = eventsResponse.data;

        // Process events to generate contributions data
        const contributions = events.reduce((acc, event) => {
            if (event.type === 'PushEvent') {
                const date = event.created_at.slice(0, 10);
                acc[date] = (acc[date] || 0) + 1;
            }
            return acc;
        }, {});

        // Fetch repositories from the GitHub profile
        const repositoriesResponse = await axios.get(`https://api.github.com/users/${githubUsername}/repos`);
        const repositories = repositoriesResponse.data;

        // Render the web page with contribution graph and repository images
        app.get('/', (req, res) => {
            res.render('index', {
                contributionGraph: JSON.stringify(contributions, null, 2),
                repositories,
            });
        });

        
        app.listen(port, () => {
            console.log(`Server listening at http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}

// Run the function
getContributionsAndRepositories();
