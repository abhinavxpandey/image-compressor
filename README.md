# Image Compressor & Passport Photo Generator

A web application that allows users to upload images, compress them, and generate multiple passport-size photo copies on an A4 sheet.

This is my first full-stack project, built while learning how frontend and backend applications communicate and how files can be uploaded and processed on a server.

## Features

* Image upload
* Image compression
* Passport-size photo generation
* Generate multiple passport photo copies
* Arrange copies on an A4 sheet
* Download the processed image
* In-memory image processing using Buffers

## Tech Stack

### Frontend

* HTML
* CSS
* JavaScript

### Backend

* Node.js
* Express.js
* Multer
* Sharp

### Deployment

* Frontend: Vercel
* Backend: Render

---

## How It Works

The application has a simple frontend-backend flow:

```text
User
 │
 │ Upload image
 ▼
Frontend
 │
 │ HTTP POST request
 ▼
Express Backend
 │
 ▼
Multer
 │
 │ Image Buffer
 ▼
Sharp
 │
 │ Process image
 ▼
Processed Image Buffer
 │
 ▼
Frontend
 │
 ▼
Download
```

The frontend is responsible for the user interface and sending the image to the backend.

The Node.js backend receives the uploaded image, processes it using Sharp, and sends the resulting image back to the frontend.

---

# Image Compression

For image compression, the user uploads an image through the frontend.

The image is sent to the backend using a `POST` request.

Multer handles the uploaded file and provides its data through:

```js
req.file.buffer
```

The Buffer is then passed to Sharp for processing.

A simplified flow is:

```text
Image
  ↓
Multer
  ↓
req.file.buffer
  ↓
Sharp
  ↓
Compression
  ↓
New Image Buffer
  ↓
HTTP Response
  ↓
Download
```

The processed image is kept in memory instead of creating unnecessary temporary files.

---

# Passport Photo Generator

The passport-photo feature uses the same upload and processing system.

The user provides:

* An image
* Number of copies required

For example:

```text
Photo: person.jpg
Copies: 8
```

The backend first creates one passport-size version of the uploaded image.

It then creates an A4 canvas and places the requested number of copies onto it.

```text
Uploaded Image
      ↓
    Multer
      ↓
 Image Buffer
      ↓
    Sharp
      ↓
Resize / Crop
      ↓
Passport Photo
      ↓
Create A4 Canvas
      ↓
Place Multiple Copies
      ↓
Final Image Buffer
      ↓
Download
```

The current implementation uses approximately **35 × 45 mm at 300 DPI**, corresponding to about **413 × 531 pixels**.

The A4 canvas is created at approximately **2480 × 3508 pixels**, corresponding to A4 at 300 DPI.

---

# Multiple Copy Layout

The number of copies is sent by the frontend as form data.

For example:

```text
copies = 8
```

Sharp's `composite()` operation is used to place the individual passport photos onto the A4 canvas.

Conceptually:

```text
┌───────────────────────────────┐
│ [1] [2] [3] [4] [5]           │
│                               │
│ [6] [7] [8]                   │
│                               │
│                               │
│             A4                │
└───────────────────────────────┘
```

---

# Buffers

```js
req.file.buffer
```

Sharp can process this Buffer directly.

The processing can then produce another Buffer:

```text
Original Image Buffer
        ↓
       Sharp
        ↓
Processed Image Buffer
```

For the passport-photo feature, the process continues:

```text
Original Image Buffer
        ↓
       Sharp
        ↓
Passport Photo Buffer
        ↓
       Sharp
        ↓
A4 Image Buffer
```

The final Buffer is sent back to the frontend as the HTTP response.

---


## Passport Photo

```http
POST /passport
```

Receives an image and the requested number of copies.

### Input
Example:

```text
photo: image.jpg
copies: 8
```

### Output

A JPEG containing the generated passport photos arranged on an A4 canvas.

---

# Error Handling

The backend performs basic validation before processing.

For example, it checks whether an image was uploaded:

```js
if (!req.file) {
  return res.status(400).json({message: "No image uploaded"});
}
```

The passport-photo route also validates the number of requested copies.
Unexpected processing errors are handled using `try...catch`.

---

# What I Learned

This project helped me understand:

* How a frontend communicates with a backend
* Express routes
* HTTP POST requests
* File uploads with Multer
* `multipart/form-data`
* Node.js Buffers
* Image processing with Sharp
* Asynchronous JavaScript
* Sending binary data in HTTP responses
* CORS
* Connecting a deployed frontend and backend
---

## Project Status

This project was built as a learning project while learning backend development.


