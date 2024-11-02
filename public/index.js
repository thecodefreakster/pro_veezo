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


// Helper function to generate a random video ID
function generateRandomId() {
    return Math.random().toString(36).substr(2, 9); // Random ID generation logic
}

async function upload() {
    const fileInputValue = $("#selectedFile").val();
    if (fileInputValue !== "" && fileInputValue.trim() !== "") {
        const file = fileInput.files[0];
        
        if (!file) {
            alert("Please select a file to upload.");
            return;
        }

        $(".headline").hide();
        $(".description").hide();
        $(".upload-button").hide();
        $(".headline-uploading").show();
        $(".description-uploading").show();
        $("#selectedFile").removeClass("clickListenerFile");

        try {
            // Step 1: Request a signed URL from your server
            const response = await fetch('/api/get-signed-url', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fileName: file.name })
            });
            
            if (!response.ok) throw new Error("Failed to get signed URL.");
            const { url } = await response.json();

            // Step 2: Use the signed URL to upload the file
            const uploadResponse = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': file.type,  // Set content type if needed
                },
                body: file
            });

            if (!uploadResponse.ok) throw new Error("Upload failed.");

            // Step 3: Redirect or notify user of success
            const fileId = file.name.split('.')[0]; // Use the file name as ID or generate a unique ID if needed
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

// Helper function to reset the UI on error
function resetUI() {
    $(".headline").show();
    $(".description").show();
    $(".upload-button").show();
    $(".headline-uploading").hide();
    $(".description-uploading").hide();
}

