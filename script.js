document.getElementById('searchBtn').addEventListener('click', async () => {
    const tags = document.getElementById('tags').value.trim().replace(/\s+/g, '_');
    const limit = document.getElementById('limit').value;
    const resultsDiv = document.getElementById('results');
    
    resultsDiv.textContent = 'Loading...';

    try {
        // Build the API URL
        // Example: https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&json=1&limit=10&tags=samus_aran
        const url = `https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&json=1&limit=${encodeURIComponent(limit)}&tags=${encodeURIComponent(tags)}`;

        const response = await fetch(url);
        if (!response.ok) {
            resultsDiv.textContent = `Error: ${response.statusText}`;
            return;
        }

        const posts = await response.json();

        if (!posts || posts.length === 0) {
            resultsDiv.textContent = 'No results found.';
            return;
        }

        // Clear results
        resultsDiv.innerHTML = '';

        // Display images
        posts.forEach(post => {
            const img = document.createElement('img');
            img.src = post.preview_url;
            img.title = `Tags: ${post.tags}\nScore: ${post.score}`;
            resultsDiv.appendChild(img);
        });
    } catch (err) {
        resultsDiv.textContent = `Error: ${err.message}`;
    }
});
