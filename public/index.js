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
        //upload();
        handleFileChange();
    }
});

// Click handler for triggering file selection
function handleClick() {
    if ($(".clickListenerFile")[0]) {
        $(".clickListenerFile").click();
    }
}

const handleFileChange = async (event) => {
    console.log('fileChange---');
    event.preventDefault();

    // Get the file from the input element
    const file = event.target.files?.[0];

    if (file) {
        try {
            // Set the upload URL for GCS directly
            const bucketName = 'veezopro_videos'; // Replace with your actual bucket name
            const filename = `${generateId(file.name)}.${file.name.split('.').pop()}`;
            const gcsUrl = `https://storage.googleapis.com/${bucketName}/${filename}`;

            // Upload the file to Google Cloud Storage directly
            const response = await fetch(gcsUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': file.type, // Ensure GCS stores with the correct MIME type
                },
                body: file,
            });

            if (!response.ok) {
                throw new Error('File upload failed');
            }

            // Update the local video URL for playback
            const localUrl = URL.createObjectURL(file);
            setVideoUrl(localUrl);

            // Redirect to the video URL or update the page URL to reflect the new video ID
            const playbackUrl = `/v?id=${filename}`;
            window.history.pushState({}, '', playbackUrl);

            // Indicate the upload progress as complete
            setUploadProgress(100);
        } catch (error) {
            console.error('Upload error:', error);
        } finally {
            // Reset the state after the upload is complete or if an error occurred
            setUploading(false);
            setFinalizing(false);
        }
    }
};

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
