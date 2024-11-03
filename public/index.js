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
// // function upload() {
// //     var fileInputValue = $("#selectedFile").val();
// //     if (fileInputValue !== "" && fileInputValue.trim() !== "") {
// //         var formData = new FormData($('form')[0]);
// //         $(".headline").hide();
// //         $(".description").hide();
// //         $(".upload-button").hide();
// //         $(".headline-uploading").show();
// //         $(".description-uploading").show();
// //         $("#selectedFile").removeClass("clickListenerFile");

// //         $.ajax({
// //             xhr: function() {
// //                 var xhr = new window.XMLHttpRequest();

// //                 // Upload progress event
// //                 xhr.upload.addEventListener("progress", function(evt) {
// //                     if (evt.lengthComputable) {
// //                         var percentComplete = evt.loaded / evt.total;
// //                         percentComplete = parseInt(percentComplete * 100);
// //                         $(".description-uploading").html(percentComplete + "% complete.");

// //                         if (percentComplete === 100) {
// //                             $(".description-uploading").html("Finalizing...");
// //                         }
// //                     }
// //                 }, false);

// //                 return xhr;
// //             },
// //             url: '/api/upload',  // This endpoint should handle the upload to GCS
// //             type: 'POST',
// //             context: this,
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

// async function getSignedUrl(fileName) {
//     try {
//         const response = await fetch('/api/get-signed-url', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ fileName }),
//         });

//         if (!response.ok) throw new Error(`Error fetching signed URL: ${response.statusText}`);

//         const { url } = await response.json();
//         return url;
//     } catch (error) {
//         console.error("Error getting signed URL:", error);
//         throw error;
//     }
// }


// async function upload() {
//     const fileInputValue = $("#selectedFile").val();
//     if (fileInputValue !== "" && fileInputValue.trim() !== "") {
//         const file = fileInput.files[0];

//         if (!file) {
//             alert("Please select a file to upload.");
//             return;
//         }

//         $(".headline").hide();
//         $(".description").hide();
//         $(".upload-button").hide();
//         $(".headline-uploading").show();
//         $(".description-uploading").show();
//         $("#selectedFile").removeClass("clickListenerFile");

//         try {
//             // Request a signed URL from the server
//             const url = await GetSignedUrl(file.name);

//             // Use the signed URL to upload the file directly to GCS
//             const uploadResponse = await fetch(url, {
//                 method: 'PUT',
//                 headers: { 'Content-Type': file.type || 'video/quicktime' },
//                 body: file
//             });

//             if (!uploadResponse.ok) throw new Error("Upload failed.");

//             // Redirect or notify user of success
//             const fileId = generateId(file.name); // Generate unique ID if needed
//             window.location.href = `https://www.veezo.pro/v_?id=${fileId}`;

//         } catch (error) {
//             console.error("Upload error:", error);
//             alert("An error occurred during the upload. Please try again.");
//             resetUI();
//         }
//     } else {
//         alert("Please select a file to upload.");
//     }
// }


// // async function upload() {
// //     const fileInputValue = $("#selectedFile").val();
// //     if (fileInputValue !== "" && fileInputValue.trim() !== "") {
// //         const file = fileInput.files[0];

// //         if (!file) {
// //             alert("Please select a file to upload.");
// //             return;
// //         }

// //         $(".headline").hide();
// //         $(".description").hide();
// //         $(".upload-button").hide();
// //         $(".headline-uploading").show();
// //         $(".description-uploading").show();
// //         $("#selectedFile").removeClass("clickListenerFile");

// //         try {
// //             //gsu
// //             const url = await GetSignedUrl(file.name);
// //             const response = await fetch(url, {
// //                 method: 'PUT',
// //                 body: file,
// //               });
      
// //             // Step 1: Request a signed URL from your server
// //             // const response = await fetch('/api/get-signed-url', {
// //             //     method: 'POST',
// //             //     headers: { 'Content-Type': 'application/json' },
// //             //     body: JSON.stringify({ fileName: file.name })
// //             // });
            
// //             if (!response.ok) throw new Error(`Failed to get signed URL. ${response.Error}`);
// //             //const { url } = await response.json();

// //             // Step 2: Use the signed URL to upload the file
// //             const uploadResponse = await fetch(url, {
// //                 method: 'PUT',
// //                 headers: {
// //                     'Content-Type': file.type || 'video/quicktime', // Use 'application/octet-stream' if unsure
// //                 },
// //                 body: file
// //             });

// //             if (!uploadResponse.ok) throw new Error("Upload failed.");

// //             // Step 3: Redirect or notify user of success
// //             const fileId = generateId(file.name); // Generate a unique ID if needed
// //             window.location.href = `https://www.veezo.pro/v_?id=${fileId}`;

// //         } catch (error) {
// //             console.error("Upload error:", error);
// //             alert("An error occurred during the upload. Please try again.");
// //             resetUI();
// //         }
// //     } else {
// //         alert("Please select a file to upload.");
// //     }
// // }


// // Helper function to reset the UI on error
// function resetUI() {
//     $(".headline").show();
//     $(".description").show();
//     $(".upload-button").show();
//     $(".headline-uploading").hide();
//     $(".description-uploading").hide();
// }




let target = document.documentElement;
let body = document.body;
let fileInput = document.getElementById("selectedFile");

if (fileInput) {
    fileInput.onchange = upload;
}

// Prevent default behavior when dragging over the target
target.addEventListener('dragover', (e) => {
    e.preventDefault();
    body.classList.add('dragging');
});

// Remove dragging class when leaving the drop zone
target.addEventListener('dragleave', () => {
    body.classList.remove('dragging');
});

// Handle the drop event
target.addEventListener('drop', (e) => {
    e.preventDefault();
    body.classList.remove('dragging');
    fileInput.files = e.dataTransfer.files;
    upload();
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
    fileInput.click();
}

// Function to handle the file upload
async function upload() {
    const fileInputValue = $("#selectedFile").val();
    if (fileInputValue.trim() !== "") {
        const file = fileInput.files[0];

        if (!file) {
            alert("Please select a file to upload.");
            return;
        }

        $(".headline, .description, .upload-button").hide();
        $(".headline-uploading, .description-uploading").show();
        $("#selectedFile").removeClass("clickListenerFile");

        try {
            // Request a signed URL from the server
            const url = await getSignedUrl(file.name);

            // Use the signed URL to upload the file directly to GCS
            const uploadResponse = await fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': file.type || 'video/quicktime' },
                body: file
            });

            if (!uploadResponse.ok) throw new Error("Upload failed.");

            // Redirect or notify user of success
            const fileId = generateId(file.name); // Generate unique ID if needed
            window.location.href = `https://www.veezo.pro/v_?id=${fileId}`;

        } catch (error) {
            console.error("Upload error:", error);
            alert("An error occurred during the upload. Please try again.");
            resetUI();
        }
    } else {
        alert("Please select a file to upload.");
    }
}

// Helper function to generate a unique ID
function generateId(filename) {
    return filename.split('.')[0] + '_' + Math.random().toString(36).substr(2, 9);
}

// Fetch signed URL
async function getSignedUrl(fileName) {
    try {
        const response = await fetch('/api/get-signed-url', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fileName }),
        });

        if (!response.ok) throw new Error(`Error fetching signed URL: ${response.statusText}`);

        const { url } = await response.json();
        return url;
    } catch (error) {
        console.error("Error getting signed URL:", error);
        throw error;
    }
}

// Helper function to reset the UI on error
function resetUI() {
    $(".headline, .description, .upload-button").show();
    $(".headline-uploading, .description-uploading").hide();
}
