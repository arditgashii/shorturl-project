/* Function to short URL */
function shortenUrl() {
    /* Declarated constant variables that connect's with ID's in Html  */
    const longUrlInput = document.getElementById('longUrl');
    const expirationSelect = document.getElementById('expiration');
    const shortUrlSpan = document.getElementById('shortUrl');
    const recentUrlsContainer = document.getElementById('recentUrls');
    const expiredAlert = document.getElementById('expiredAlert');
  
    const longUrl = longUrlInput.value.trim();
    const expirationMinutes = parseInt(expirationSelect.value, 10);

    /* If there isn't a valid URL, show Alert to enter a valid URL */
    if (!longUrl) {
      alert('Please enter a valid URL');
      return;
    }
    
    /* Constant variables to generate random path of URL  */
    const shortPath = generateRandomString();
    const shortUrl = `https://${getHostname(longUrl)}/${shortPath}`;


    /* Constant variable to set Expiration time for each shortened URL's */
    const expirationTime = new Date().getTime() + expirationMinutes * 60000;
    localStorage.setItem(shortPath, JSON.stringify({ longUrl, expirationTime }));
    
    /* Create Div Element */
    const linkElement = document.createElement('div');
    linkElement.className = 'd-flex align-items-center justify-content-center pb-2';
    /* Add Recent shortened URL's that redirect to Long link, and add Delete Icon that has a onClick Event */
    linkElement.innerHTML = `
      <a href="#" class="me-4" data-shortpath="${shortPath}" onclick="redirectToLongUrl.call(this)">${shortUrl}</a>
      <i class="fa fa-trash-o" onclick="deleteShortenedUrl(this)"></i>
    `;
  
    recentUrlsContainer.appendChild(linkElement);
  
    longUrlInput.value = '';
}

/* Function to generate random string */
function generateRandomString() {
  /* Declarated constant variables for length and characters */
  const length = 8;
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  /* Generate a random string of characters with a specified length */
  for (let i = 0; i < length; i++) {
    /* Add a random character from the 'characters' string to the 'result' */
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
}

/* Function to extract and return the hostname from a given URL */
function getHostname(url) {
    const parser = document.createElement('a');
    parser.href = url;
    return parser.hostname;
}

/* Function to redirect to the long URL that have been shortened */
function redirectToLongUrl() {
    const shortPath = this.getAttribute('data-shortpath');
    const storedData = localStorage.getItem(shortPath);

    /* When link time expires, remove that link from page */
    if (storedData) {
      const { longUrl, expirationTime } = JSON.parse(storedData);

      if (expirationTime && new Date().getTime() > expirationTime) {

        localStorage.removeItem(shortPath);
        
        expiredAlert.classList.remove('d-none');
        setTimeout(() => {
          expiredAlert.classList.add('d-none');
        }, 5000); 
      } 
      else {
        window.open(longUrl, '_blank');
      }
    } 
    else {
      alert('Error: Long URL not found');
    }
}

/* Add function to Delete Button, when user click's that button, delete recent shortened URL */
function deleteShortenedUrl(buttonElement) {
    const shortPath = buttonElement.parentElement.querySelector('a').getAttribute('data-shortpath');
    localStorage.removeItem(shortPath);
    buttonElement.parentElement.remove();
}