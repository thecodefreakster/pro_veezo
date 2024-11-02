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

// Function to handle the file upload
function upload() {
    var fileInputValue = $("#selectedFile").val();
    if (fileInputValue !== "" && fileInputValue.trim() !== "") {
        var formData = new FormData($('form')[0]);
        $(".headline").hide();
        $(".description").hide();
        $(".upload-button").hide();
        $(".headline-uploading").show();
        $(".description-uploading").show();
        $("#selectedFile").removeClass("clickListenerFile");

        $.ajax({
            xhr: function() {
                var xhr = new window.XMLHttpRequest();

                // Upload progress event
                xhr.upload.addEventListener("progress", function(evt) {
                    if (evt.lengthComputable) {
                        var percentComplete = evt.loaded / evt.total;
                        percentComplete = parseInt(percentComplete * 100);
                        $(".description-uploading").html(percentComplete + "% complete.");

                        if (percentComplete === 100) {
                            $(".description-uploading").html("Finalizing...");
                        }
                    }
                }, false);

                return xhr;
            },
            url: '/api/upload',  // This endpoint should handle the upload to GCS
            type: 'POST',
            context: this,
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            success: function (result) {
                // Redirect to the video page using the GCS URL returned from the API
                window.location.href = `https://www.veezo.pro/v_?id=${result.id}`;
            },
            error: function () {
                $(".headline").show();
                $(".description").show();
                $(".upload-button").show();
                $(".headline-uploading").hide();
                $(".description-uploading").hide();
                alert("An error occurred during the upload. Please try again.");
            }
        });
    } else {
        alert("Please select a file to upload.");
    }
}


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

<<<<<<< HEAD
=======

async function upload() {
    const response = await fetch(`/api/gsu?filename=${file.name}`);
    const { url } = await response.json();
    var fileInput = $("#selectedFile")[0]; // Access the input element directly
    var file = fileInput.files[0]; // Get the selected file
    if (file) {
        try {
            $(".headline").hide();
            $(".description").hide();
            $(".upload-button").hide();
            $(".headline-uploading").show();
            $(".description-uploading").show();
            $("#selectedFile").removeClass("clickListenerFile");

            // Step 1: Get the signed URL and upload the file
            $.ajax({
                url: url, // Directly use the signed URL
                method: 'PUT',
                data: file,
                processData: false,
                contentType: file.type, // Set the content type dynamically
                xhr: function () {
                    var xhr = new window.XMLHttpRequest();
                    xhr.upload.addEventListener("progress", function (evt) {
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
                success: function (result) {
                    // Handle success (optionally notify the user)
                    $(".description-uploading").html("Upload complete!");
                    window.location.href = `https://www.veezo.pro/v_?id=${result.id}`; // Adjust as needed
                },
                error: function () {
                    $(".headline").show();
                    $(".description").show();
                    $(".upload-button").show();
                    $(".headline-uploading").hide();
                    $(".description-uploading").hide();
                    alert("An error occurred during the upload. Please try again.");
                }
            });
        } catch (error) {
            console.error("Error during upload:", error);
            alert("Failed to get signed URL. Please try again.");
        }
    } else {
        alert("Please select a file to upload.");
    }
}



>>>>>>> 8413f517feb5cd9ec07d13e3e5b04c1835b35f53
// Helper function to generate a random video ID
function generateRandomId() {
    return Math.random().toString(36).substr(2, 9); // Random ID generation logic
}


// Helper function to generate a random video ID
function generateRandomId() {
    return Math.random().toString(36).substr(2, 9); // Random ID generation logic
}


