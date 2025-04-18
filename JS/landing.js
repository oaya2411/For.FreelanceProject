document.addEventListener('DOMContentLoaded', function() {
    // Only run this code on landing page
    if (document.body.getAttribute('data-page') !== 'landing') return;

    const profileIcon = document.getElementById('profileIcon');
    const registerButton = document.getElementById('registerButton');
    const loginButton = document.getElementById('LogInButton');
    if (!profileIcon || !registerButton || !postProject) {
        console.error('Could not find required elements in DOM');
        return;
    }

    function decodeJWT(token) {
        try {
            // Split the token into parts
            const parts = token.split('.');
            if (parts.length !== 3) {
                throw new Error('Invalid JWT token');
            }
            
            // Decode the payload (second part)
            const payload = parts[1];
            const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
            
            // Parse the JSON payload
            const payloadObj = JSON.parse(decodedPayload);
            
            // Display the complete payload
            // let displayData = document.getElementById('data');
            // displayData.innerHTML = decodedPayload;
            const postProject = document.getElementById('postProject');
            // let data2 = document.getElementById('data2');

            // Extract the role
            const role = payloadObj.role;  // Access the role property from the parsed object
            if(role !== 'ServiceProvider'){
                // data2.innerHTML += role;
                postProject.style.display = 'inline-block';
            }
            // // Display the role
            // data2.innerHTML = role;
            
            return payloadObj;  // Return the parsed object for further use
        } catch (error) {
            console.error('Error decoding JWT:', error);
            return null;
        }
    }

    // Rest of your landing page auth code...
    function checkAuth() {
        const token = localStorage.getItem('authToken');
        userData = decodeJWT(token);
        if (token) {
            registerButton.style.display = 'none';
            loginButton.style.display = 'none';
            profileIcon.style.display = 'inline-block';
        } else {
            registerButton.style.display = 'inline-block';
            loginButton.style.display = 'inline-block';
            profileIcon.style.display = 'none';
            postProject.style.display = 'none';
        }
    }
    
    const timelineItems = document.querySelectorAll('.timeline-item');
  
  const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
        });
    }, { threshold: 0.1 });
    
    timelineItems.forEach(item => {
        observer.observe(item);
    });

    checkAuth();
});
function initAuthUI() {
    const maxAttempts = 10;
    let attempts = 0;
    
    function checkElements() {
        attempts++;
        const profileIcon = document.getElementById('profileIcon');
        const registerButton = document.getElementById('registerButton');
        
        if (profileIcon && registerButton) {
            // Elements found, proceed with logic
            function checkAuth() {
                const token = localStorage.getItem('authToken');
                
                if (token) {
                    registerButton.style.display = 'none';
                    profileIcon.style.display = 'inline-block';
                } else {
                    registerButton.style.display = 'inline-block';
                    profileIcon.style.display = 'none';
                }
            }
            
            checkAuth();
        } else if (attempts < maxAttempts) {
            // Elements not found yet, try again
            setTimeout(checkElements, 100);
        } else {
            console.error('Could not find required elements after maximum attempts');
        }
    }
    checkElements();

    document.getElementById('profileIcon').addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector('.dropdown-content').classList.toggle('show');
    });
    
    // Close the dropdown if clicked outside
    window.onclick = function(e) {
        if (!e.target.matches('.dropbtn') && !e.target.matches('.dropbtn *')) {
            var dropdowns = document.getElementsByClassName("dropdown-content");
            for (var i = 0; i < dropdowns.length; i++) {
                var openDropdown = dropdowns[i];
                if (openDropdown.classList.contains('show')) {
                    openDropdown.classList.remove('show');
                }
            }
        }
    }

    
}

// Start the process when DOM is ready
if (document.body.getAttribute('data-page') === 'landing') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAuthUI);
    } else {
        initAuthUI();
    }
}