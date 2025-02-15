document.addEventListener('DOMContentLoaded', () => {
    fetchAndInsertContent('sd-group', 'blog-posts-group', 4);
    fetchAndInsertContent('sd-insurance', 'blog-posts-insurance', 4);
    fetchAndInsertContent('sd-life-wealth', 'blog-posts-life-wealth', 4);
    fetchAndInsertContent('sd-loans', 'blog-posts-loans', 4);
});

function fetchAndInsertContent(folder, elementId, fileCount) {
    const promises = [];
    for (let i = 1; i <= fileCount; i++) {
        const filePath = `${folder}/${folder}${i}.html`;
        promises.push(fetch(filePath).then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        }));
    }

    Promise.all(promises)
        .then(contents => {
            const combinedContent = contents.map((content, index) => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(content, 'text/html');
                const title = doc.querySelector('h1') ? doc.querySelector('h1').textContent : 'No Title';
                const paragraph = doc.querySelector('p') ? doc.querySelector('p').textContent : 'No Content';
                const excerpt = paragraph.length > 150 ? paragraph.substring(0, 150) + '...' : paragraph;
                const filePath = `${folder}/${folder}${index + 1}.html`;
                return `<div class="blog-post">
                            <h3>${title}</h3>
                            <p>${excerpt}</p>
                            <a href="${filePath}" target="_blank">Read More</a>
                        </div>`;
            }).join('');
            document.getElementById(elementId).innerHTML = combinedContent;
        })
        .catch(error => console.error('Error fetching content:', error));
}