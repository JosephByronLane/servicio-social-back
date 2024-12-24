# Image Endpoint Documentation

## Overview

This Endpoint allows you to upload/view images for listings.

This endpoint is a little different than the rest, since it works VERY differently.

The general steps for uploading an image are as follow:

---

## Endpoints

### Create upload session

**Method**: `POST`  
**URL**: `/image/upload`

This creates an upload session link between you and the backend server. It returns a unique UUID which you **need to save** because you will submit it with the final listing in the `tempId` field.

##### Why do i need to do this? What's the  point?
The crux of this problem lies in such:
The user needs to upload the images before they finalize the listing, and you can't really assign a `listingId` to an image because the listing tecnically hasn't been created yet.

What the server does is it creates a folder in the temp directory (which gets deleted after 24h) and stores the images there before moving them to the non-temp storage and assigning them the listing.


**You call this endpoint as soon as the user enters the form to create a listing.**

#### Request Body

No request body.
#### Return Body
**Status**: `200`  

```json
{
	"tempId": "12adfdsa3-f4a6-4vvd-bf9a-b5t55yd2ce79"
}
```
---

### Upload images

**Method**: `POST`  
**URL**: `/image/upload/:tempId`

This endpoint is where you will upload all of your images to, it will consequently upload them to the server in a temp directory, before moving them to a more permanent solution once the listing is finalized.

I can't just show you a `Request Body` since tecnically it isn't one. Its a `multipart/form-data` that the browser generates.

Since I don't expect any of you to have worked with something like this before, here is a code example illustrating what I mean.

#### Code Example


First is the HTML where you will need to upload the images to.

##### HTML
```HTML
    <!-- User would drag and drop images here -->
    <section>
      <h2>Upload Images</h2> 

    <!-- User would drag and drop images here -->
      <div id="dropArea" class="drop-area">
        <p>Drag & Drop Images Here</p>

        <input type="file" id="fileElem" multiple accept="image/*">

        <!-- Button to manually open a system dialog to pic files -->
        <label class="button" for="fileElem">Select Images</label> 
      </div>
      <div id="gallery" class="gallery"></div>
    </section>
```


Alongside said HTML we also need to HTML to deal with it.
##### JavaScript

```JavaScript

    // We first get the drop thingy to define it.
    const dropArea = document.getElementById('dropArea');

    // We add a listener for when stuff drops into it.
    dropArea.addEventListener('drop', handleDrop, false);


    function handleDrop(e) {
    // 'e' is the event object that is passed to the function when a drop event occurs

        // 'dt' is assigned the dataTransfer property of the event object
        // dataTransfer contains the data being dragged, in this case, iamges
        let dt = e.dataTransfer;

        // 'files' is assigned the files property of the dataTransfer object
        // files is a FileList object that contains the list of files being dragged
        let files = dt.files;

        handleFiles(files);
    }

    // handleFiles is a function that processes the files
    // it is called with the files object as an argument
    async function handleFiles(files) {

      // This is optional, but its a reference to our previously defined tempId
      // which should of been created when the user first decided to create the listing.
      // If by some magic the page didn't generate a tempId you would do something here.
      if (!tempId) {

        //You could make a POST to get a tempId, or tell the user  to reload the form.
        return;
      }
      
        // Create a new FormData object to hold the form data (This is a default JS class)
        const formData = new FormData(); 

        // Loop through each file in the 'files' array (aka the images)
        for (let file of files) {
            // Append each file to the FormData object with the key 'images'
            formData.append('images', file);
        }

        try {
            // Send a POST request to the server with the FormData object
            const response = await fetch(`http://api-url.org/image/upload/${tempId}`, {
                method: 'POST',
                body: formData, // Set the request body to the FormData object
            });
            
            // Check if the response status is not OK (status code 200-299)
            // though by default the API would return a 200 if all's good
            if (!response.ok) {
                throw new Error(error);
            }

            // Parse the response body as JSON
            const data = await response.json();   

            //Function to display all uploaded images back to the user, its defined below under the `Viewing the images` section.
            displayImages(data.images);

        } catch (error) {
            // Log any errors that occur during the fetch request
            console.error(error);
        }
    }

```

#### Return Body

If the API got the images and all's gucci, then it should return this:
**Status**: `200`  

```json
{
	"images": [
		{
			"id": 41,
			"imageUrl": "assets/temp/4a3cffd1-2a29-40fc-afa9-447f18a4d250/images-1735011368688-243427510.jpg"
		},
		{
			"id": 42,
			"imageUrl": "assets/temp/4a3cffd1-2a29-40fc-afa9-447f18a4d250/images-1735011368689-69885700.png"
		}
	]
}
```

**NOTE:** If youd like to try it yourself through  Postman or Insomnia, make sure to mark the body as a `Form`/`Multipart` (You can probably set it as a form and add more than 1 field), and in the `name` put `images` and in the `value` change it to `file` and select the image you wish to upload.

---


### Viewing the images

The images are served statically, so after uploading youd like to show them (Wether it be a preview in the submit form, or in the final Listing page) you call the API's url followed by the image's  `imageUrl`.

#### Code example

```JavaScript
// We get the element who we want to set the image to
const imgElement = document.createElement('img');

// We query the API as mentioned above.
imgElement.src = `http://127.0.0.1:3000/${imageUrl}`;
imgElement.alt = 'Uploaded Image';
```

Though theres certainly fancier ways to do it. For example you could wrap it into a function and pass it an `images` variable (array of images)

```JavaScript
    // You would call this function, which would be called after uploading all the images
    function displayImages(images) {
      for (let img of images) {
        const imgElement = document.createElement('img');
        imgElement.src = `http://127.0.0.1:3000/${img.imageUrl}`;
        imgElement.alt = 'Uploaded Image';
        gallery.appendChild(imgElement); //Look at the first HTML example to view what `gallery` is.
      }
    }
```

#### Return Body
**Status**: `200`  

There isn't really a return body because it returns the binary image data.

---