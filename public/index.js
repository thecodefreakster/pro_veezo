let target = document.documentElement;
let body = document.body;
let fileInput = document.getElementById("selectedFile");

if (fileInput) {
    fileInput.onchange = function() {
        upload();
    };
}

// Prevent default behavior when dragging over the target
target.addEventListener('dragover', (e) => {
    if ($(".clickListenerFile")[0]) {
        e.preventDefault();
        body.classList.add('dragging');
    }
});

// Remove dragging class when leaving the drop zone
target.addEventListener('dragleave', () => {
    body.classList.remove('dragging');
});

// Handle the drop event
target.addEventListener('drop', (e) => {
    if ($(".clickListenerFile")[0]) {
        e.preventDefault();
        body.classList.remove('dragging');
        fileInput.files = e.dataTransfer.files;
        upload();
    }
});

// Handle pasting files from clipboard
window.addEventListener('paste', e => {
    if (e.clipboardData.files.length > 0) {
        fileInput.files = e.clipboardData.files;
        upload();
    }
});

// Click handler for triggering file selection
function handleClick() {
    if ($(".clickListenerFile")[0]) {
        $(".clickListenerFile").click();
    }
}

// UPLOAD SIGN
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


//---UPLOAD NO SIGN
// async function upload() {
//     const file = fileInput.files[0];

//     if (!file) {
//         alert("Please select a file to upload.");
//         return;
//     }

//     $(".headline, .description, .upload-button").hide();
//     $(".headline-uploading, .description-uploading").show();

//     try {
//         const signedUrl = await GetSignedUrl(file.name);
//         const uploadResponse = await fetch(signedUrl, {
//             method: 'PUT',
//             headers: {
//                 'Content-Type': file.type || 'application/octet-stream',
//             },
//             body: file
//         });

//         if (!uploadResponse.ok) throw new Error("Upload failed.");

//         // Redirect or notify user of success
//         const fileId = generateId(file.name);
//         window.location.href = `https://www.veezo.pro/v_?id=${fileId}`;

//     } catch (error) {
//         console.error("Upload error:", error);
//         alert("An error occurred during the upload. Please try again.");
//         resetUI();
//     }
// }


//----------------
// async function upload() {
//     const file = fileInput.files[0];

//     if (!file) {
//         alert("Please select a file to upload.");
//         return;
//     }

//     $(".headline, .description, .upload-button").hide();
//     $(".headline-uploading, .description-uploading").show();

//     try {
//         // Get the signed URL for the file
//         const signedUrl = await GetSignedUrl(file.name);

//         // Initialize a new XMLHttpRequest for tracking progress
//         const xhr = new XMLHttpRequest();

//         // Set up the progress event listener
//         xhr.upload.addEventListener("progress", function(evt) {
//             if (evt.lengthComputable) {
//                 const percentComplete = Math.round((evt.loaded / evt.total) * 100);
//                 $(".description-uploading").html(`${percentComplete}% complete.`);

//                 if (percentComplete === 100) {
//                     $(".description-uploading").html("Finalizing...");
//                 }
//             }
//         }, false);

//         // Set up success and error callbacks
//         xhr.onload = function() {
//             if (xhr.status === 200) {
//                 // const fileId = generateId(file.name);
//                 const fileId = generateRandomId();
//                 // Redirect to the simplified URL with only the generated ID
//                 window.location.href = `https://www.veezo.pro/v_?id=${fileId}`;
//             } else {
//                 alert("An error occurred during the upload. Please try again.");
//                 resetUI();
//             }
//         };

//         xhr.onerror = function() {
//             console.error("Upload error:", xhr.statusText);
//             alert("An error occurred during the upload. Please try again.");
//             resetUI();
//         };

//         // Open a PUT request with the signed URL
//         xhr.open("PUT", signedUrl, true);
//         xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");

//         // Send the file data
//         xhr.send(file);
//     } catch (error) {
//         console.error("Upload error:", error);
//         alert("An error occurred during the upload. Please try again.");
//         resetUI();
//     }
// }


//GOODCODE
// async function upload() {
//     const file = fileInput.files[0];

//     if (!file) {
//         alert("Please select a file to upload.");
//         return;
//     }

//     // Hide initial UI elements and show uploading UI
//     $(".headline, .description, .upload-button").hide();
//     $(".headline-uploading, .description-uploading").show();

//     // Generate a random ID to use as the new filename in GCS
//     const fileId = generateRandomId();
//     const newFileName = `${fileId}.${file.type.split('/')[1]}`; // Use generated ID with file extension

//     try {
//         // Get a signed URL for the new file name
//         const signedUrl = await GetSignedUrl(newFileName);

//         // Initialize a new XMLHttpRequest for tracking progress
//         const xhr = new XMLHttpRequest();

//         // Set up the progress event listener
//         xhr.upload.addEventListener("progress", function(evt) {
//             if (evt.lengthComputable) {
//                 const percentComplete = Math.round((evt.loaded / evt.total) * 100);
//                 $(".description-uploading").html(`${percentComplete}% complete.`);
                
//                 if (percentComplete === 100) {
//                     $(".description-uploading").html("Finalizing...");
//                 }
//             }
//         }, false);

//         // Set up success and error callbacks
//         xhr.onload = function() {
//             if (xhr.status === 200) {
//                 // Redirect to the URL with only the generated ID
//                 window.location.href = `https://www.veezo.pro/v_?id=${fileId}`;
//             } else {
//                 alert("An error occurred during the upload. Please try again.");
//                 resetUI();
//             }
//         };

//         xhr.onerror = function() {
//             console.error("Upload error:", xhr.statusText);
//             alert("An error occurred during the upload. Please try again.");
//             resetUI();
//         };

//         // Open a PUT request with the signed URL
//         xhr.open("PUT", signedUrl, true);
//         xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");

//         // Send the file data
//         xhr.send(file);
//     } catch (error) {
//         console.error("Upload error:", error);
//         alert("An error occurred during the upload. Please try again.");
//         resetUI();
//     }
// }


///BESTTTTTTTT
async function upload() {
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select a file to upload.");
        return;
    }

    // Hide initial UI elements and show uploading UI
    $(".headline, .description, .upload-button").hide();
    $(".headline-uploading, .description-uploading").show();

    // Generate a random ID to use as the new filename in GCS
    const fileId = generateRandomId();
    const newFileName = `${fileId}.mov`; // Use generated ID with .mov extension

    try {
        // Get a signed URL for the new file name
        const signedUrl = await GetSignedUrl(newFileName);

        // Initialize a new XMLHttpRequest for tracking progress
        const xhr = new XMLHttpRequest();

        // Set up the progress event listener
        xhr.upload.addEventListener("progress", function(evt) {
            if (evt.lengthComputable) {
                const percentComplete = Math.round((evt.loaded / evt.total) * 100);
                $(".description-uploading").html(`${percentComplete}% complete.`);
                
                if (percentComplete === 100) {
                    $(".description-uploading").html("Finalizing...");
                }
            }
        }, false);

        // Set up success and error callbacks
        xhr.onload = function() {
            if (xhr.status === 200) {
                // Redirect to the URL with only the generated ID
                window.location.href = `https://www.veezo.pro/v_?id=${fileId}`;
            } else {
                alert("An error occurred during the upload. Please try again.");
                resetUI();
            }
        };

        xhr.onerror = function() {
            console.error("Upload error:", xhr.statusText);
            alert("An error occurred during the upload. Please try again.");
            resetUI();
        };

        // Open a PUT request with the signed URL
        xhr.open("PUT", signedUrl, true);
        xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");

        // Send the file data
        xhr.send(file);
    } catch (error) {
        console.error("Upload error:", error);
        alert("An error occurred during the upload. Please try again.");
        resetUI();
    }
}

// Helper function to generate a random video ID
function generateRandomId() {
    return Math.random().toString(36).substr(2, 6); // Generates a 6-character ID
}

// Helper function to reset the UI on error
function resetUI() {
    $(".headline").show();
    $(".description").show();
    $(".upload-button").show();
    $(".headline-uploading").hide();
    $(".description-uploading").hide();
}