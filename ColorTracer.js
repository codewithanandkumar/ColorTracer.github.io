const displayedImage = document.getElementById('displayedImage');
const imageCanvas = document.getElementById('imageCanvas');
const colorDisplay = document.getElementById('colorDisplay');
const hexValue = document.getElementById('hexValue');
const rgbValue = document.getElementById('rgbValue');
const magnifier = document.getElementById('magnifier');
const dragAndDrop = document.getElementById('dragAndDrop');
const imageInput = document.getElementById('imageInput');

// Default image initialization
window.addEventListener('load', () => {
    drawImageOnCanvas(displayedImage.src);
});

dragAndDrop.addEventListener('click', () => imageInput.click());
dragAndDrop.addEventListener('dragover', (event) => {
    event.preventDefault();
    dragAndDrop.classList.add('dragging');
});
dragAndDrop.addEventListener('dragleave', () => dragAndDrop.classList.remove('dragging'));
dragAndDrop.addEventListener('drop', (event) => {
    event.preventDefault();
    dragAndDrop.classList.remove('dragging');
    const file = event.dataTransfer.files[0];
    if (file) loadNewImage(file);
});
imageInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) loadNewImage(file);
});

function loadNewImage(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        displayedImage.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

displayedImage.addEventListener('load', () => drawImageOnCanvas(displayedImage.src));
displayedImage.addEventListener('mousemove', (event) => {
    const { x, y } = getCoordinates(event);
    const pixelData = getPixelData(x, y);

    if (pixelData) {
        const [r, g, b] = pixelData;
        updateMagnifier(event, r, g, b);
    }
});

displayedImage.addEventListener('mouseleave', () => {
    magnifier.style.display = 'none';
});

displayedImage.addEventListener('click', (event) => {
    const { x, y } = getCoordinates(event);
    const pixelData = getPixelData(x, y);

    if (pixelData) {
        const [r, g, b] = pixelData;
        updateColorDisplay(r, g, b);
    }
});

function drawImageOnCanvas(src) {
    const ctx = imageCanvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => {
        imageCanvas.width = img.width;
        imageCanvas.height = img.height;
        ctx.drawImage(img, 0, 0);
    };
}

function getCoordinates(event) {
    const rect = displayedImage.getBoundingClientRect();
    const scaleX = displayedImage.naturalWidth / rect.width;
    const scaleY = displayedImage.naturalHeight / rect.height;
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;
    return { x, y };
}

function getPixelData(x, y) {
    const ctx = imageCanvas.getContext('2d');
    return ctx.getImageData(x, y, 1, 1).data;
}

function updateMagnifier(event, r, g, b) {
    magnifier.style.display = 'block';
    magnifier.style.left = `${event.clientX - magnifier.offsetWidth / 2}px`;
    magnifier.style.top = `${event.clientY - magnifier.offsetHeight / 2}px`;
    magnifier.style.backgroundColor = rgbToHex(r, g, b);
}

function updateColorDisplay(r, g, b) {
    const hex = rgbToHex(r, g, b);
    const rgb = `rgb(${r}, ${g}, ${b})`;
    colorDisplay.style.backgroundColor = hex;
    hexValue.textContent = hex;
    rgbValue.textContent = rgb;
}

function rgbToHex(r, g, b) {
    return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
}

// Copy to clipboard functionality
document.querySelectorAll('.copyable span').forEach((element) => {
    element.addEventListener('click', () => {
        const textToCopy = element.textContent;
        navigator.clipboard.writeText(textToCopy).then(() => {
            alert('Text copied: ' + textToCopy);
        }).catch(() => {
            alert('Failed to copy text.');
        });
    });
});