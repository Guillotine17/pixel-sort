// TODO parameter inputs
    // sort option
    // trigger option
    // set threshold option
    // retain original image


let img;
let rowIndex = 0;
let pd = null;
const inputPath = './cat.png';
const max = 1000;
const doExport = false;
let sortMethod = 'BRIGHTNESS'; // BRIGHTNESS|SATURATION
const sortMethodOptions = [
    'BRIGHTNESS', 'SATURATION', 'HUE', 'LIGHTNESS', 'RED', 'GREEN', 'BLUE'
];
let sortDirection = 'ASC'; // DESC|ASC

let thresholdMethod = 'BRIGHTNESS';
let thresholdGTLT = 'LESS';
let thresholdValue = 150;
document.getElementById('thresholdValue').value = thresholdValue;

let frameCount = 0;
let paused = false;
const thresholdMethodOptions = [
    'BRIGHTNESS', 'SATURATION', 'HUE', 'LIGHTNESS', 'RED', 'GREEN', 'BLUE'
];

let rotation = 0;

function preload() {
    loadImage(inputPath, (loadResult) => {
        img = loadResult;
    });
}
function renderInputField() {
    const input = createFileInput(handleFile);
    document.getElementById('inputContainer').appendChild(input.elt);
}

function setup() {
    renderInputField();
    handleImageInput(img);
}

function handleFile(file) {
    if (file.type === 'image') {
        clear();
        resetMatrix();
        removeElements();
        loadImage(file.data, handleImageInput);
    } else {
      img = null;
    }
    renderInputField();
  }

function sortFunction(a, b) {
    if (sortMethod === 'BRIGHTNESS') {
        return sortDirection === 'ASC' ? brightness(a) - brightness(b) : brightness(b) - brightness(a);
    } else if (sortMethod === 'SATURATION') {
        return sortDirection === 'ASC' ? saturation(a) - saturation(b) : saturation(b) - saturation(a);
    } else if (sortMethod === 'HUE') {
        return sortDirection === 'ASC' ? hue(a) - hue(b) : hue(b) - hue(a);
    } else if (sortMethod === 'LIGHTNESS') {
        return sortDirection === 'ASC' ? lightness(a) - lightness(b) : lightness(b) - lightness(a);
    } else if (sortMethod === 'RED') {
        return sortDirection === 'ASC' ? red(a) - red(b) : red(b) - red(a);
    } else if (sortMethod === 'GREEN') {
        return sortDirection === 'ASC' ? green(a) - green(b) : green(b) - green(a);
    } else if (sortMethod === 'BLUE') {
        return sortDirection === 'ASC' ? blue(a) - blue(b) : blue(b) - blue(a);
    }
}

function thresholdTest(color) {
    if (thresholdMethod === 'BRIGHTNESS') {
        return (thresholdGTLT === 'LESS') ? brightness(color) < thresholdValue : brightness(color) > thresholdValue;
    } else if (thresholdMethod === 'SATURATION') {
        return (thresholdGTLT === 'LESS') ? saturation(color) < thresholdValue : saturation(color) > thresholdValue;
    } else if (thresholdMethod === 'RED') {
        return (thresholdGTLT === 'LESS') ? red(color) < thresholdValue : red(color) > thresholdValue;
    } else if (thresholdMethod === 'GREEN') {
        return (thresholdGTLT === 'LESS') ? green(color) < thresholdValue : green(color) > thresholdValue;
    } else if (thresholdMethod === 'BLUE') {
        return (thresholdGTLT === 'LESS') ? blue(color) < thresholdValue : blue(color) > thresholdValue;
    } else if (thresholdMethod === 'HUE') {
        return (thresholdGTLT === 'LESS') ? hue(color) < thresholdValue : hue(color) > thresholdValue;
    } else if (thresholdMethod === 'LIGHTNESS') {
        return (thresholdGTLT === 'LESS') ? lightness(color) < thresholdValue : lightness(color) > thresholdValue;
    }
}

function draw() {
    if (img && !paused && rowIndex <= height) {
        console.log(rowIndex);
        loadPixels();
        let rowColors = [];
        const colorsToSort = [];
        let triggerHit = false;
        for (let index = 0; index < width; index++) {
            if (!triggerHit && thresholdTest(get(index, rowIndex))) {
                triggerHit = true;
            }
            if (triggerHit) {
                colorsToSort.push(get(index, rowIndex));
            } else {
                rowColors.push(get(index, rowIndex));
            }
        }
        colorsToSort.sort((a, b) => {
            return sortFunction(a, b);
        });
        // colorsToSort.reverse();
        rowColors = rowColors.concat(colorsToSort);
        rowColors.forEach((rowColor, rcIndex) => {
            set(rcIndex, rowIndex, rowColor);
        });
        updatePixels();
        rowIndex += 1;
    }
    if (doExport && rowIndex > height) {
        saveCanvas('frame-' + frameCount + '.png', 'png');
        frameCount += 1;
        rowIndex = 0;
        thresholdValue = thresholdValue - 2;
    }
}

function arrayInsert(subjectArray, toInsert, startIndex) {
    for (let index = 0; index < toInsert.length; index++) {
        subjectArray[index + startIndex] = toInsert[index];
        if (index === toInsert.length - 1) {
            console.log(index);
        }
    }
    // let retVal = [];
    // retVal = retVal.concat(Array.from(subjectArray.slice(0, startIndex)));
    // retVal = retVal.concat(Array.from(toInsert));
    // retVal = retVal.concat(Array.from(subjectArray.slice((startIndex + toInsert.length), subjectArray.length)));
    // return new Uint8ClampedArray(retVal);
    return subjectArray;
}

function togglePause() {
    paused = !paused;
    document.getElementById('pauseButton').innerText = paused ? 'Play' : 'Pause';
}
// togglePause();

function setVariable(variableCode, value) {
    console.log(variableCode);
    switch (variableCode) {
        case 'THRESHOLD_GTLT':
            thresholdGTLT = document.getElementById('thresholdGTLT').value;
            console.log(thresholdGTLT);
            break;
        case 'THRESHOLD_VALUE':
            thresholdValue = value;
            console.log(thresholdValue);
            break;
        case 'SORT_METHOD':
            sortMethod = document.getElementById('sortMethod').value;
            console.log(sortMethod);
            break;
        case 'THRESHOLD_METHOD':
            thresholdMethod = document.getElementById('thresholdMethod').value;
            console.log(thresholdMethod);
            break;
        case 'SORT_DIRECTION':
            sortDirection = document.getElementById('sortDirection').value;
            console.log(sortDirection);
            break;
        case 'ROTATION':
            rotation = parseInt(document.getElementById('rotation').value);
            console.log(rotation);
            break;
        default:
            break;
    }
}

function handleImageInput(loadResult) {
    console.log('roation', typeof(rotation));
    img = loadResult;
    let drawHeight = img.height;
    let drawWidth = img.width;
    console.log(drawWidth);
    if (img.height > max && img.height >= img.width) {
        console.log('TOO TALL');
        drawWidth = (img.width / img.height) * max;
        drawHeight = max;
    } else if (img.width > max && img.width >= img.height) {
        console.log('TOO WIDE');
        drawHeight = (img.height / img.width) * max;
        drawWidth = max;
    }
    console.log(img);
    if (rotation === 90) {
        console.log('NINETY');
        resizeCanvas(drawHeight, drawWidth);
        console.log(drawWidth + 'VS' + width);
        console.log(drawHeight + 'VS' + height);
        background(220);
        translate(width / 2, height / 2);
        rotate(PI/2);
        image(img, -height / 2, -width / 2, height, width);
    } else if (rotation === 180) {
        resizeCanvas(drawWidth, drawHeight);
        background(220);
        translate(width / 2, height / 2);
        rotate(PI);
        image(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);

    } else if (rotation === 270) {
        console.log('270');
        resizeCanvas(drawHeight, drawWidth);
        background(220);
        translate(drawHeight / 2, drawWidth / 2);
        rotate(-PI/2);
        image(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
    } else {
        resizeCanvas(drawWidth, drawHeight);
        background(220);
        image(img, 0, 0, drawWidth, drawHeight);

    }
    pd = pixelDensity();
    loadPixels();
    rowIndex = 0;
    

    // resizeCanvas(drawWidth, drawHeight);

    // image(img, 0, 0, drawWidth, drawHeight);
    // img = createImg(file.data, '');
}
function startOver() {
    clear();
    frameCount = 0;
    // removeElements();
    handleImageInput(img);
}
