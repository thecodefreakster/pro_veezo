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

async function uploadFileInChunks(file) {
    const chunkSize = 4 * 1024 * 1024; // 4 MB
    const totalChunks = Math.ceil(file.size / chunkSize);
    const fileName = file.name;

    for (let i = 0; i < totalChunks; i++) {
        const chunk = file.slice(i * chunkSize, (i + 1) * chunkSize);
        const formData = new FormData();
        formData.append('file', chunk, fileName);
        formData.append('chunkIndex', i);
        formData.append('totalChunks', totalChunks);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Error uploading chunk ${i + 1}: ${response.statusText}`);
            }
            console.log(`Uploaded chunk ${i + 1} of ${totalChunks}`);
        } catch (error) {
            console.error('Error uploading chunk:', error);
            alert('Error uploading chunk. Please try again.');
            return;
        }
    }
    alert('File uploaded successfully!');
}

function upload() {
    var fileInputValue = $("#selectedFile").val();
    if (fileInputValue !== "" && fileInputValue.trim() !== "") {
        const file = fileInput.files[0];

        // Validate file size (100MB = 100 * 1024 * 1024 bytes)
        const maxSize = 100 * 1024 * 1024; // 100MB
        if (file.size > maxSize) {
            alert("File size exceeds the maximum limit of 100MB.");
            return;
        }

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
