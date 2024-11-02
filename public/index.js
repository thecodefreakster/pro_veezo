// let target = document.documentElement;
// let body = document.body;
// let fileInput = document.getElementById("selectedFile");

// if (fileInput) {
//     fileInput.onchange = function() {
//         upload();
//     };
// }

// // Prevent default behavior when dragging over the target
// target.addEventListener('dragover', (e) => {
//     if ($(".clickListenerFile")[0]) {
//         e.preventDefault();
//         body.classList.add('dragging');
//     }
// });

// // Remove dragging class when leaving the drop zone
// target.addEventListener('dragleave', () => {
//     body.classList.remove('dragging');
// });

// // Handle the drop event
// target.addEventListener('drop', (e) => {
//     if ($(".clickListenerFile")[0]) {
//         e.preventDefault();
//         body.classList.remove('dragging');
//         fileInput.files = e.dataTransfer.files;
//         upload();
//     }
// });

// // Handle pasting files from clipboard
// window.addEventListener('paste', e => {
//     if (e.clipboardData.files.length > 0) {
//         fileInput.files = e.clipboardData.files;
//         upload();
//     }
// });

// // Click handler for triggering file selection
// function handleClick() {
//     if ($(".clickListenerFile")[0]) {
//         $(".clickListenerFile").click();
//     }
// }

// // Helper function to generate a unique ID (or you could use a UUID library)
// function generateId(filename) {
//     return filename.split('.')[0] + '_' + Math.random().toString(36).substr(2, 9);
// }

// // Function to handle the file upload
// function upload() {
//     var fileInputValue = $("#selectedFile").val();
//     if (fileInputValue !== "" && fileInputValue.trim() !== "") {
//         var formData = new FormData($('form')[0]);
//         $(".headline").hide();
//         $(".description").hide();
//         $(".upload-button").hide();
//         $(".headline-uploading").show();
//         $(".description-uploading").show();
//         $("#selectedFile").removeClass("clickListenerFile");

//         $.ajax({
//             xhr: function() {
//                 var xhr = new window.XMLHttpRequest();

//                 // Upload progress event
//                 xhr.upload.addEventListener("progress", function(evt) {
//                     if (evt.lengthComputable) {
//                         var percentComplete = evt.loaded / evt.total;
//                         percentComplete = parseInt(percentComplete * 100);
//                         $(".description-uploading").html(percentComplete + "% complete.");

//                         if (percentComplete === 100) {
//                             $(".description-uploading").html("Finalizing...");
//                         }
//                     }
//                 }, false);

//                 return xhr;
//             },
//             url: '/api/upload',  // This endpoint should handle the upload to GCS
//             type: 'POST',
//             context: this,
//             data: formData,
//             cache: false,
//             contentType: false,
//             processData: false,
//             success: function (result) {
//                 // Redirect to the video page using the GCS URL returned from the API
//                 window.location.href = `https://www.veezo.pro/v_?id=${result.id}`;
//             },
//             error: function () {
//                 $(".headline").show();
//                 $(".description").show();
//                 $(".upload-button").show();
//                 $(".headline-uploading").hide();
//                 $(".description-uploading").hide();
//                 alert("An error occurred during the upload. Please try again.");
//             }
//         });
//     } else {
//         alert("Please select a file to upload.");
//     }
// }


// // function upload() {
// //     var fileInput = $("#selectedFile")[0]; // Access the input element directly
// //     var file = fileInput.files[0]; // Get the selected file
// //     if (file) {
// //         $(".headline").hide();
// //         $(".description").hide();
// //         $(".upload-button").hide();
// //         $(".headline-uploading").show();
// //         $(".description-uploading").show();
// //         $("#selectedFile").removeClass("clickListenerFile");

// //         // Create a FormData object to hold the file
// //         var formData = new FormData();
// //         formData.append('file', file); // Append the file directly

// //         $.ajax({
// //             xhr: function () {
// //                 var xhr = new window.XMLHttpRequest();
// //                 // Upload progress event
// //                 xhr.upload.addEventListener("progress", function (evt) {
// //                     if (evt.lengthComputable) {
// //                         var percentComplete = (evt.loaded / evt.total) * 100;
// //                         $(".description-uploading").html(percentComplete.toFixed(0) + "% complete.");
                        
// //                         if (percentComplete === 100) {
// //                             $(".description-uploading").html("Finalizing...");
// //                         }
// //                     }
// //                 }, false);
// //                 return xhr;
// //             },
// //             url: '/api/upload',  // Endpoint that handles the upload to GCS
// //             type: 'POST',
// //             data: formData,
// //             cache: false,
// //             contentType: false,
// //             processData: false,
// //             success: function (result) {
// //                 // Redirect to the video page using the GCS URL returned from the API
// //                 window.location.href = `https://www.veezo.pro/v_?id=${result.id}`;
// //             },
// //             error: function () {
// //                 $(".headline").show();
// //                 $(".description").show();
// //                 $(".upload-button").show();
// //                 $(".headline-uploading").hide();
// //                 $(".description-uploading").hide();
// //                 alert("An error occurred during the upload. Please try again.");
// //             }
// //         });
// //     } else {
// //         alert("Please select a file to upload.");
// //     }
// // }

// // Helper function to generate a random video ID
// function generateRandomId() {
//     return Math.random().toString(36).substr(2, 9); // Random ID generation logic
// }


// // Helper function to generate a random video ID
// function generateRandomId() {
//     return Math.random().toString(36).substr(2, 9); // Random ID generation logic
// }


async function handleFileUpload(file) {
    try {
        // Step 1: Get a signed URL from the server for the file
        const response = await fetch('/api/getSignedUrl', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fileName: file.name })
        });

        const { url } = await response.json();
        if (!url) throw new Error('Failed to get signed URL');

        // Step 2: Upload the file to the signed URL
        const uploadResponse = await fetch(url, {
            method: 'PUT',
            body: file,
        });

        if (!uploadResponse.ok) throw new Error('File upload failed');

        // Step 3: Show the video using a local URL
        const videoUrl = URL.createObjectURL(file);
        displayVideo(videoUrl);

    } catch (error) {
        console.error('Upload error:', error);
    }
}

function displayVideo(videoUrl) {
    // Hide the upload button and display video element
    document.querySelector('.main-area').innerHTML = `
        <video controls autoplay class="uploaded-video" style="width:80%; max-width:800px;">
            <source src="${videoUrl}" type="video/mp4">
            Your browser does not support the video tag.
        </video>
    `;
}

function handleClick() {
    // Trigger file selection when the user clicks 'Browse'
    document.getElementById("selectedFile").click();
}

document.getElementById("selectedFile").addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (file) {
        document.querySelector('.headline-uploading').style.display = 'block';
        document.querySelector('.description-uploading').textContent = 'Uploading...';
        await handleFileUpload(file);
        document.querySelector('.headline-uploading').style.display = 'none';
    }
});
