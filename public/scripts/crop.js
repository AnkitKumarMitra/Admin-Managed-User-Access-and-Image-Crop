let cropper;
const fileInputLabelImage = document.getElementById('fileInputLabelImage');

function initCropper() {
    const fileInput = document.getElementById('photo');
    const cropperModalImage = document.getElementById('cropperModalImage');

    if (fileInput.files.length > 0) {
        const reader = new FileReader();

        reader.onload = function (e) {
            fileInputLabelImage.src = e.target.result;

            

            if (cropper) {
                cropper.destroy();
            }

            cropperModalImage.src = e.target.result;

            cropper = new Cropper(cropperModalImage, {
                viewMode: 2,
                aspectRatio: 1,
                autoCropArea: 1,
            });
        };

        reader.readAsDataURL(fileInput.files[0]);
    }
}

function crop() {
    const croppedImageDataUrl = cropper.getCroppedCanvas().toDataURL();
    fileInputLabelImage.src = croppedImageDataUrl;

    cropper.reset();

    $('#cropperModal').modal('hide');
}

$('#cropperModal').on('shown.bs.modal', function () {
    if (!cropper) {
        cropper = new Cropper(cropperModalImage, {
            viewMode: 2,
            aspectRatio: 1,
            autoCropArea: 1,
        });
    }
});

$('#cropperModal').on('shown.bs.modal', function () {
    if (cropper) {
        cropper.destroy();
    }

    cropper = new Cropper(cropperModalImage, {
        viewMode: 2,
        aspectRatio: 1,
        autoCropArea: 1,
    });
});