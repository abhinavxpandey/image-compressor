console.log("Script initialized");

const imageInput = document.getElementById("imageInput");
const originalPreview = document.getElementById("originalPreview");
const compressBtn = document.getElementById("compressBtn");

const resultEmpty = document.getElementById("resultEmpty");
const resultBox = document.getElementById("resultBox");

const compressedPreview = document.getElementById("compressedPreview");
const originalSize = document.getElementById("originalSize");
const compressedSize = document.getElementById("compressedSize");
const downloadLink = document.getElementById("downloadLink");



imageInput.addEventListener("change", () => {

    const image = imageInput.files[0];

    if (!image) {
        return;
    }

    
    originalPreview.src = URL.createObjectURL(image);
    originalPreview.classList.remove("hidden");

    
    originalSize.textContent = `Original: ${formatSize(image.size)}`;
});



compressBtn.addEventListener("click", async () => {

    const image = imageInput.files[0];

    if (!image) {
        alert("Please select an image first.");
        return;
    }

   
    const formData = new FormData();

    formData.append("image", image);


   
    const response = await fetch("https://image-compressor-fcbs.onrender.com/upload", {
        method: "POST",
        body: formData
    });

    
    const compressedImage = await response.blob();


    
    const compressedURL = URL.createObjectURL(compressedImage);

    compressedPreview.src = compressedURL;

    
    resultEmpty.classList.add("hidden");
    resultBox.classList.remove("hidden");


    
    compressedSize.textContent =
        `Compressed: ${formatSize(compressedImage.size)}`;


    
    downloadLink.href = compressedURL;
});



function formatSize(bytes) {

    if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}