window.onload = function() {
    let userToken = ''; // Global variable to store token after fetching user data

    const getForm = document.getElementById('get-user-form');
    
    getForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        let formData = new FormData(event.target);
        const token = formData.get('token');
        console.log('Token:', token);

        try {
            const response = await fetch('http://127.0.0.1:8000/api/user', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, 
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (response.ok) {
                document.getElementById('user-data').innerHTML = `<p>User Email: ${data.email}<br>
                                                                    User Name: ${data.name}</p>`;
                userToken = token; // Store the token globally for later use
                await fetchAllPosts(userToken); // Fetch all posts after getting the token
            }

        } catch (error) {
            console.log(error);
        }
    });

    const postForm = document.getElementById('create-post-form');
    
    postForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        if (!userToken) {
            console.log('No token available. Please get user data first.');
            return; // If no token is available, exit early
        }

        let formData = new FormData(event.target);

        try {
            const response = await fetch('http://127.0.0.1:8000/api/posts', { // Make sure your route matches this
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${userToken}`, // Use the stored token
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: formData.get('title'), // Get the title from the form
                    body: formData.get('body')    // Get the body from the form
                })
            });

            const data = await response.json();

            if (response.ok) {
                document.getElementById('post-data').innerHTML = `<p>Post Created Successfully!</p>
                                                                  <p><strong>Title:</strong> ${data.title}, <strong>Body:</strong> ${data.body}</p>`;
                await fetchAllPosts(userToken);

                document.getElementById('title').value = ''; // Clear the title input field
                document.getElementById('body').value = ''; // Clear the body textarea
            } else {
                console.log('Failed to create post', data);
            }

        } catch (error) {
            console.log(error);
        }
    });

    async function fetchAllPosts(token) {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/posts', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const posts = await response.json();

            if (response.ok) {
                const postsContainer = document.getElementById('user-posts');
                postsContainer.innerHTML = '';
                posts.forEach(post => {
                    postsContainer.innerHTML += `
                        <div class="post">
                            <p>Title: ${post.title}</p>
                            <p>Body: ${post.body}</p>
                        </div>
                    `;
                });
            }
        } catch (error) {
            console.log(error);
        }
    }
};
