import * as Carousel from './Carousel.js';
// You have axios, you don't need to import it
console.log(axios);

// The breed selection input element.
const breedSelect = document.getElementById('breedSelect');
// The information section div element.
const infoDump = document.getElementById('infoDump');
// The progress bar div element.
const progressBar = document.getElementById('progressBar');
// The get favourites button element.
const getFavouritesBtn = document.getElementById('getFavouritesBtn');

// Step 0: Store your API key here for reference and easy access.
const API_KEY = 'live_B4lSYccZoilhe0BuKRZcCzOIPGVJx9e7uOavpH3V13WW57YgVkZUoDpmIsots5UQ';



/**
 * 4. Change all of your fetch() functions to axios!
 * - axios has already been imported for you within index.js.
 * - If you've done everything correctly up to this point, this should be simple.
 * - If it is not simple, take a moment to re-evaluate your original code.
 * - Hint: Axios has the ability to set default headers. Use this to your advantage
 *   by setting a default header with your API key so that you do not have to
 *   send it manually with all of your requests! You can also set a default base URL!
 */
async function initialLoad() {
    const req = await axios.get("https://api.thecatapi.com/v1/breeds");
    const data = req.data;
  
    // Create an option element for each breed and add it to the breedSelect dropdown
    for (let i = 0; i < data.length; i++) {
      let option = document.createElement("OPTION");
      option.id = data[i].id;
      option.value = data[i].id;
      option.text = data[i].name;
  
      breedSelect.appendChild(option);
    }
  }
  
  // Execute initialLoad to populate the breedSelect dropdown
  initialLoad();
  
  // Event listener for when the user selects a breed
  breedSelect.addEventListener("change", async (e) => {
    // Clear the previous carousel items
    Carousel.clear();
  
    // Get the breed ID from the selected option
    let index = e.target.selectedIndex;
    let val = e.target.options[index].id;
    console.log(val);
  
    // Fetch images for the selected breed from the API
    const req = await axios.get(
      `https://api.thecatapi.com/v1/images/search?limit=10&breed_ids=${val}&api_key=${API_KEY}`,
      {
        // Pass the updateProgress function to track download progress
        onDownloadProgress: updateProgress
      }
    );
    console.log(req.data[0].url); // Log the first image URL to verify the data
  
    // Create and append carousel items for each image
    for (let i = 0; i < req.data.length; i++) {
      let carItem = Carousel.createCarouselItem(req.data[i].url);
      Carousel.appendCarousel(carItem);
    }
  
    // Start the carousel
    Carousel.start();
  });
/**
 * 5. Add axios interceptors to log the time between request and response to the console.
 * - Hint: you already have access to code that does this!
 * - Add a console.log statement to indicate when requests begin.
 * - As an added challenge, try to do this on your own without referencing the lesson material.
 */

// Axios interceptors for logging request and response time
axios.interceptors.request.use(request => {
    // Reset the progress bar width to 0% when a new request starts
    progressBar.style.width = "0%";
    progressBar.style.transition = "width 0.5s ease";
  
    /**As a final element of progress indication, add the following to your Axios interceptors:
  In your request interceptor, set the body element's cursor style to "progress."
  In your response interceptor, set the body element's cursor style to "default." */
    // Change the cursor style to 'progress' when the request starts
    document.body.style.cursor = 'progress';
    
    // Save the start time on the request object
    request.startTime = new Date();
    console.log(`Request started at: ${request.startTime.toLocaleTimeString()}`);
    return request;
  }, error => {
    // Handle any errors with the request
    return Promise.reject(error);
  });
  
  // Response Interceptor: Log the response time and calculate the duration
  axios.interceptors.response.use(response => {
    // Calculate the duration between the request and response
    const duration = new Date() - response.config.startTime;
    console.log(`Response received at: ${new Date().toLocaleTimeString()}`);
    console.log(`Request duration: ${duration} ms`);
  
    // Reset the cursor style to 'default' when the response is received
    document.body.style.cursor = 'default';
    
    return response;
  }, error => {
    // Handle any errors with the response
    // Reset cursor to default in case of an error too
    document.body.style.cursor = 'default';
    return Promise.reject(error);
  });
/**
 * 6. Next, we'll create a progress bar to indicate the request is in progress.
 * - The progressBar element has already been created for you.
 *  - You need only to modify its "width" style property to align with the request progress.
 * - In your request interceptor, set the width of the progressBar element to 0%.
 *  - This is to reset the progress with each request.
 * - Research the axios onDownloadProgress config option.
 * - Create a function "updateProgress" that receives a ProgressEvent object.
 *  - Pass this function to the axios onDownloadProgress config option in your event handler.
 * - console.log your ProgressEvent object within updateProgess, and familiarize yourself with its structure.
 *  - Update the progress of the request using the properties you are given.
 * - Note that we are not downloading a lot of data, so onDownloadProgress will likely only fire
 *   once or twice per request to this API. This is still a concept worth familiarizing yourself
 *   with for future projects.
 */
// Function to update the progress bar
function updateProgress(progressEvent) {
    // Log the ProgressEvent object to see its structure
    console.log(progressEvent);
  
    if (progressEvent.total > 0) {
      // Calculate the percentage progress
      let percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      progressBar.style.width = `${percent}%`;
    }
  }
  
/**
 * 7. As a final element of progress indication, add the following to your axios interceptors:
 * - In your request interceptor, set the body element's cursor style to "progress."
 * - In your response interceptor, remove the progress cursor style from the body element.
 */
// Axios interceptors for logging request/response time
 // Change cursor to indicate loading
/**
 * 8. To practice posting data, we'll create a system to "favourite" certain images.
 * - The skeleton of this function has already been created for you.
 * - This function is used within Carousel.js to add the event listener as items are created.
 *  - This is why we use the export keyword for this function.
 * - Post to the cat API's favourites endpoint with the given ID.
 * - The API documentation gives examples of this functionality using fetch(); use Axios!
 * - Add additional logic to this function such that if the image is already favourited,
 *   you delete that favourite using the API, giving this function "toggle" functionality.
 * - You can call this function by clicking on the heart at the top right of any image.
 */
export async function favourite(imgId) {
        try {
          // Get all favourites
          const favouritesResponse = await axios.get('https://api.thecatapi.com/v1/favourites', {
            headers: { 'x-api-key': API_KEY },
          });
      
          // Check if the image is already in favourites
          const favouriteExists = favouritesResponse.data.some(fav => fav.image.id === imgId);
      
          if (favouriteExists) {
            // Remove the image from favourites
            const favToRemove = favouritesResponse.data.find(fav => fav.image.id === imgId);
            await axios.delete(`https://api.thecatapi.com/v1/favourites/${favToRemove.id}`, {
              headers: { 'x-api-key': API_KEY },
            });
            console.log(`Removed image with ID ${imgId} from favourites`);
            alert('Image removed from favourites');
          } else {
            // Add the image to favourites
            await axios.post('https://api.thecatapi.com/v1/favourites', {
              image_id: imgId,
            }, {
              headers: { 'x-api-key': API_KEY },
            });
            console.log(`Added image with ID ${imgId} to favourites`);
            alert('Image added to favourites');
          }
        } catch (error) {
          console.error('Error favouriting the image:', error);
          alert('An error occurred while favouriting the image');
        }
      }

  /**
   * 9. Test your favourite() function by creating a getFavourites() function.
   * - Use Axios to get all of your favourites from the cat API.
   * - Clear the carousel and display your favourites when the button is clicked.
   *  - You will have to bind this event listener to getFavouritesBtn yourself.
   *  - Hint: you already have all of the logic built for building a carousel.
   *    If that isn't in its own function, maybe it should be so you don't have to
   *    repeat yourself in this section.
   */

  async function getFavourites() {
    try {
      // Clear the carousel
      Carousel.clear();
  
      // Fetch all favourite images
      const response = await axios.get('https://api.thecatapi.com/v1/favourites', {
        headers: { 'x-api-key': API_KEY },
      });
  
      if (response.data.length === 0) {
        alert('You have no favourite images.');
        return;
      }
  
      // Add each favourite image to the carousel
      response.data.forEach(fav => {
        const favImage = fav.image;
        const carItem = Carousel.createCarouselItem(favImage.url, favImage.alt, favImage.id);
        Carousel.appendCarousel(carItem);
      });
  
      // Start the carousel
      Carousel.start();
    } catch (error) {
      console.error('Error fetching favourites:', error);
      alert('An error occurred while fetching your favourites.');
    }
  }
  
  // Bind the event listener for the "Get Favourites" button
  getFavouritesBtn.addEventListener('click', getFavourites);
  
  