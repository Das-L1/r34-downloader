document.getElementById('searchBtn').addEventListener('click', async () => {
    const tags = document.getElementById('tags').value.trim().replace(/\s+/g, '_');
    const limit = document.getElementById('limit').value;
    const resultsDiv = document.getElementById('results');
    
    resultsDiv.textContent = 'Loading...';

    try {
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

        resultsDiv.textContent = `Found ${posts.length} images. Downloading...`;

        // Fetch and download each image
        for (let i = 0; i < posts.length; i++) {
            const post = posts[i];
            const imageUrl = post.file_url; 
            // Note: file_url is the full image. If you prefer previews, use preview_url. 
            // But usually, you'd download the full image.
            
            try {
                const imgResponse = await fetch(imageUrl);
                if (!imgResponse.ok) {
                    console.warn(`Failed to fetch image: ${imageUrl}`);
                    continue;
                }
                const blob = await imgResponse.blob();

                // Create a temporary link to trigger download
                const blobUrl = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = blobUrl;
                // Attempt to name the file using the post id or tags
                a.download = `rule34_${post.id}.jpg`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(blobUrl); // Free memory
            } catch (err) {
                console.warn(`Error downloading image ${imageUrl}: `, err);
            }
        }

        resultsDiv.textContent = 'Download attempts complete.';
    } catch (err) {
        resultsDiv.textContent = `Error: ${err.message}`;
    }
});
