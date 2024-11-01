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

// Function to handle the file upload
async function upload() {
    var fileInputValue = $("#selectedFile").val();
    if (fileInputValue !== "" && fileInputValue.trim() !== "") {
        var file = fileInput.files[0]; // Get the first file from the input

        // Check if the file size is less than 100MB
        if (file.size > 100 * 1024 * 1024) {
            alert("File size exceeds 100MB. Please select a smaller file.");
            return;
        }

        $(".headline").hide();
        $(".description").hide();
        $(".upload-button").hide();
        $(".headline-uploading").show();
        $(".description-uploading").show();
        $("#selectedFile").removeClass("clickListenerFile");

        try {
            await uploadFile(file); // Call the uploadFile function
        } catch (error) {
            $(".headline").show();
            $(".description").show();
            $(".upload-button").show();
            $(".headline-uploading").hide();
            $(".description-uploading").hide();
            alert("An error occurred during the upload. Please try again.");
        }
    } else {
        alert("Please select a file to upload.");
    }
}

// The uploadFile function
async function uploadFile(file) {
    // Get a signed URL from your backend
    const response = await fetch(`/v_?id=${file.name}`);
    if (!response.ok) {
        throw new Error('Failed to get signed URL');
    }
    const { url } = await response.json();

    // Upload the file to the signed URL
    const uploadResponse = await fetch(url, {
        method: 'PUT',
        body: file,
        headers: {
            'Content-Type': 'application/octet-stream', // Set the correct content type
        },
    });

    if (!uploadResponse.ok) {
        throw new Error('File upload failed');
    }

    console.log('File uploaded successfully!');

    // After successful upload, redirect to the video page
    const fileId = generateId(file.name); // Create a unique ID for the video
    window.location.href = `https://www.veezo.pro/v_?id=${fileId}`; // Redirect with the file ID
}

