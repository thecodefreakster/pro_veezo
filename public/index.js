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

// Helper function to generate a unique ID (or you could use a UUID library)
function generateId(filename) {
    return filename.split('.')[0] + '_' + Math.random().toString(36).substr(2, 9);
}

//Function to handle the file upload
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


// function upload() {
//     var fileInput = $("#selectedFile")[0]; // Access the input element directly
//     var file = fileInput.files[0]; // Get the selected file
//     if (file) {
//         const chunkSize = 4 * 1024 * 1024; // 4 MB chunk size
//         const totalChunks = Math.ceil(file.size / chunkSize); // Calculate total chunks
//         let uploadedChunks = 0; // Keep track of uploaded chunks

//         $(".headline").hide();
//         $(".description").hide();
//         $(".upload-button").hide();
//         $(".headline-uploading").show();
//         $(".description-uploading").show();
//         $("#selectedFile").removeClass("clickListenerFile");

//         // Function to upload a single chunk
//         const uploadChunk = (chunkIndex) => {
//             const start = chunkIndex * chunkSize;
//             const end = Math.min(start + chunkSize, file.size);
//             const chunk = file.slice(start, end); // Get the current chunk

//             const formData = new FormData();
//             formData.append('file', chunk);
//             formData.append('chunkIndex', chunkIndex);
//             formData.append('totalChunks', totalChunks);

//             $.ajax({
//                 xhr: function () {
//                     var xhr = new window.XMLHttpRequest();
//                     xhr.upload.addEventListener("progress", function (evt) {
//                         if (evt.lengthComputable) {
//                             var percentComplete = (uploadedChunks + (evt.loaded / evt.total)) / totalChunks;
//                             percentComplete = parseInt(percentComplete * 100);
//                             $(".description-uploading").html(percentComplete + "% complete.");

//                             if (percentComplete === 100) {
//                                 $(".description-uploading").html("Finalizing...");
//                             }
//                         }
//                     }, false);
//                     return xhr;
//                 },
//                 url: '/api/upload',  // This endpoint should handle the upload to GCS
//                 type: 'POST',
//                 data: formData,
//                 cache: false,
//                 contentType: false,
//                 processData: false,
//                 success: function (result) {
//                     uploadedChunks++; // Increment uploaded chunks count
//                     if (uploadedChunks < totalChunks) {
//                         uploadChunk(uploadedChunks); // Upload next chunk
//                     } else {
//                         // All chunks uploaded
//                         window.location.href = `https://www.veezo.pro/v_?id=${result.id}`;
//                     }
//                 },
//                 error: function () {
//                     $(".headline").show();
//                     $(".description").show();
//                     $(".upload-button").show();
//                     $(".headline-uploading").hide();
//                     $(".description-uploading").hide();
//                     alert("An error occurred during the upload. Please try again.");
//                 }
//             });
//         };

//         // Start uploading the first chunk
//         uploadChunk(0);
//     } else {
//         alert("Please select a file to upload.");
//     }
// }

// function upload() {
//     var fileInput = $("#selectedFile")[0]; // Access the input element directly
//     var file = fileInput.files[0]; // Get the selected file
//     if (file) {
//         $(".headline").hide();
//         $(".description").hide();
//         $(".upload-button").hide();
//         $(".headline-uploading").show();
//         $(".description-uploading").show();
//         $("#selectedFile").removeClass("clickListenerFile");

//         // Create a FormData object to hold the file
//         var formData = new FormData();
//         formData.append('file', file); // Append the file directly

//         $.ajax({
//             xhr: function () {
//                 var xhr = new window.XMLHttpRequest();
//                 // Upload progress event
//                 xhr.upload.addEventListener("progress", function (evt) {
//                     if (evt.lengthComputable) {
//                         var percentComplete = (evt.loaded / evt.total) * 100;
//                         $(".description-uploading").html(percentComplete.toFixed(0) + "% complete.");
                        
//                         if (percentComplete === 100) {
//                             $(".description-uploading").html("Finalizing...");
//                         }
//                     }
//                 }, false);
//                 return xhr;
//             },
//             url: '/api/upload',  // Endpoint that handles the upload to GCS
//             type: 'POST',
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


async function upload() {
    var fileInput = $("#selectedFile")[0]; // Access the input element directly
    var file = fileInput.files[0]; // Get the selected file
    if (file) {
        const url = await GetSignedUrl(file.name);
        $(".headline").hide();
        $(".description").hide();
        $(".upload-button").hide();
        $(".headline-uploading").show();
        $(".description-uploading").show();
        $("#selectedFile").removeClass("clickListenerFile");

        // Step 1: Get the signed URL
        $.get(url, function(response) {
            // Step 2: Upload the file to the signed URL
            $.ajax({
                url: response.url,
                method: 'PUT',
                data: file,
                processData: false,
                contentType: 'video/quicktime', // Set the content type
                xhr: function() {
                    var xhr = new window.XMLHttpRequest();
                    xhr.upload.addEventListener("progress", function(evt) {
                        if (evt.lengthComputable) {
                            var percentComplete = (evt.loaded / evt.total) * 100;
                            $(".description-uploading").html(percentComplete.toFixed(0) + "% complete.");
                            
                            if (percentComplete === 100) {
                                $(".description-uploading").html("Finalizing...");
                            }
                        }
                    }, false);
                    return xhr;
                },
                success: function(result) {
                    // Handle success (optionally notify the user)
                    $(".description-uploading").html("Upload complete!");
                    window.location.href = `https://www.veezo.pro/v_?id=${result.id}`; // Adjust as needed
                },
                error: function() {
                    $(".headline").show();
                    $(".description").show();
                    $(".upload-button").show();
                    $(".headline-uploading").hide();
                    $(".description-uploading").hide();
                    alert("An error occurred during the upload. Please try again.");
                }
            });
        });
    } else {
        alert("Please select a file to upload.");
    }
}



// Helper function to generate a random video ID
function generateRandomId() {
    return Math.random().toString(36).substr(2, 9); // Random ID generation logic
}


// Helper function to generate a random video ID
function generateRandomId() {
    return Math.random().toString(36).substr(2, 9); // Random ID generation logic
}


