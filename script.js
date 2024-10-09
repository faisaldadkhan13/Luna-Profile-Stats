document.getElementById('fetchBtn').onclick = async () => {
    const username = document.getElementById('username').value;
    const profileDiv = document.getElementById('profile');
    const reposDiv = document.getElementById('repos');

    profileDiv.innerHTML = 'Loading...';
    reposDiv.innerHTML = '';

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
            <p>Followers: ${userData.followers}</p>
            <p>Following: ${userData.following}</p>
            <p>Public Repos: ${userData.public_repos}</p>
        `;

        const reposResponse = await fetch(`https://api.github.com/users/${username}/repos`);
        const reposData = await reposResponse.json();
        
        reposDiv.innerHTML = '<h3>Repositories</h3><ul>' +
            reposData.map(repo => `
                <li>
                    <a href="${repo.html_url}" target="_blank">${repo.name}</a> - ${repo.stargazers_count} ⭐
                </li>
            `).join('') +
            '</ul>';
    } catch (error) {
        profileDiv.innerHTML = 'Error fetching data';
    }
};
