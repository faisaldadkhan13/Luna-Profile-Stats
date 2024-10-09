const themeToggleButton = document.getElementById('themeToggle');

let isDarkTheme = true;

themeToggleButton.onclick = () => {
    isDarkTheme = !isDarkTheme;
    document.body.style.backgroundColor = isDarkTheme ? '#121212' : '#ffffff';
    document.body.style.color = isDarkTheme ? '#e0e0e0' : '#000000';
    themeToggleButton.textContent = isDarkTheme ? 'Switch to Light Theme' : 'Switch to Dark Theme';
};

document.getElementById('fetchBtn').onclick = async () => {
    const username = document.getElementById('username').value;
    const profileDiv = document.getElementById('profile');
    const reposDiv = document.getElementById('repos');
    const chartDiv = document.getElementById('chart');

    profileDiv.innerHTML = 'Loading...';
    reposDiv.innerHTML = '';
    chartDiv.innerHTML = '';

    try {
        const userResponse = await fetch(`https://api.github.com/users/${username}`);
        const userData = await userResponse.json();
        
        if (userResponse.status === 404) {
            profileDiv.innerHTML = 'User not found';
            return;
        }

        profileDiv.innerHTML = `
            <h2>${userData.login}</h2>
            <img src="${userData.avatar_url}" alt="${userData.login}" width="100" />
            <p><strong>Bio:</strong> ${userData.bio || 'N/A'}</p>
            <p><strong>Company:</strong> ${userData.company || 'N/A'}</p>
            <p><strong>Location:</strong> ${userData.location || 'N/A'}</p>
            <p><strong>Blog:</strong> <a href="${userData.blog}" target="_blank">${userData.blog || 'N/A'}</a></p>
            <p><strong>Followers:</strong> ${userData.followers}</p>
            <p><strong>Following:</strong> ${userData.following}</p>
            <p><strong>Public Repos:</strong> ${userData.public_repos}</p>
            <p><strong>Public Gists:</strong> ${userData.public_gists}</p>
            <p><strong>Account Created:</strong> ${new Date(userData.created_at).toLocaleDateString()}</p>
        `;

        // Fetching contributions (events)
        const eventsResponse = await fetch(`https://api.github.com/users/${username}/events`);
        const eventsData = await eventsResponse.json();

        // Prepare data for chart
        const contributions = {};
        eventsData.forEach(event => {
            const date = new Date(event.created_at).toLocaleDateString();
            contributions[date] = (contributions[date] || 0) + 1;
        });

        const labels = Object.keys(contributions);
        const data = Object.values(contributions);

        // Render chart
        const ctx = document.createElement('canvas');
        chartDiv.appendChild(ctx);
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Contributions',
                    data: data,
                    borderColor: '#6200ea',
                    backgroundColor: 'rgba(98, 0, 234, 0.2)',
                    fill: true,
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Number of Contributions'
                        }
                    }
                }
            }
        });

        const reposResponse = await fetch(`https://api.github.com/users/${username}/repos`);
        const reposData = await reposResponse.json();
        
        reposDiv.innerHTML = '<h3>Repositories</h3><ul>' +
            reposData.map(repo => `
                <li>
                    <a href="${repo.html_url}" target="_blank">${repo.name}</a> - ⭐ ${repo.stargazers_count} - ${repo.description || 'No description'}
                </li>
            `).join('') +
            '</ul>';
    } catch (error) {
        profileDiv.innerHTML = 'Error fetching data';
    }
};
