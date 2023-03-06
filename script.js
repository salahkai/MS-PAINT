const colorBoxes = document.querySelector('.panel-colors-list').children;

const primaryColor = document.querySelector('.panel-colors-primary');
const secondaryColor = document.querySelector('.panel-colors-secondary');
const primaryColorBox = primaryColor.querySelector('.color-box');
const secondaryColorBox = secondaryColor.querySelector('.color-box');

const colorPicker = document.getElementById('color-picker-btn');
const editColorsBtn = document.querySelector('.panel-colors-edit');
const lineWidthSelectBtn = document.querySelector('.panel-sizes-selection');
const lineWidthSelectionMenu = document.querySelector(
  '.panel-sizes-selection-menu'
);
const panelSizes = document.querySelector('.panel-sizes');
const lineWidthSelectionList = lineWidthSelectionMenu.children;

const boardContainer = document.querySelector('.panel-board-container');
//////////////////////// Canva Variables ////////////////////////

const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');

const defaultColors = [
  '#000000',
  '#7F7F7F',
  '#880015',
  '#ED1C24',
  '#FF7F27',
  '#FFF200',
  '#22B14C',
  '#00A2E8',
  '#3F48CC',
  '#A349A4',
  '#FFFFFF',
  '#C3C3C3',
  '#B97A57',
  '#FFAEC9',
  '#FFC90E',
  '#EFE4B0',
  '#B5E61D',
  '#99D9EA',
  '#7092BE',
  '#C8BFE7',
];
const additionalColors = [];

let fillColor = '#000000';
let drawSize = 1;

// selected color ( color one or two)
let activeColorBox = primaryColorBox;

////////////////////// Popups///////////////////////
// function closePopUp
function showPopUp(poppedUpEl, popUpBtn) {
  poppedUpEl.classList.toggle('hidden');
  lineWidthSelectBtn.classList.toggle('active');
  window.addEventListener(
    'click',
    closePupUpOutside.bind(this, panelSizes, poppedUpEl, popUpBtn)
  );
}
function closePopUp(poppedUpEl, popUpBtn) {
  poppedUpEl.classList.toggle('hidden');
  popUpBtn.classList.toggle('active');
  window.removeEventListener('click', closePupUpOutside);
}

function closePupUpOutside(e, wholeEl, poppedUpEl, popUpBtn) {
  if (!wholeEl.contains(e.target)) {
    popUpBtn.classList.toggle('active');
    closePopUp(poppedUpEl);
    e.stopPropagation();
  } else {
    e.stopPropagation();
  }
}
//////////////////////// Sizes ////////////////////////

lineWidthSelectBtn.addEventListener('click', () => {
  showPopUp(lineWidthSelectionMenu, lineWidthSelectBtn);
});

[...lineWidthSelectionList].forEach((option, i) => {
  option.addEventListener('click', () => {
    changeSize(i);
    closePopUp(lineWidthSelectionMenu, lineWidthSelectBtn);
  });
});

function changeSize(size) {
  drawSize = size + 2;
}
//////////////////////// Colors ////////////////////////

// set colors list backgrounds according to colors array
function renderDefaultColorsBackground() {
  for (let i = 0; i < defaultColors.length; i++) {
    colorBoxes[i].style.backgroundColor = defaultColors[i];
  }
}
function renderAdditionalColorsBackground() {
  for (let i = 0; i < additionalColors.length; i++) {
    colorBoxes[i + 20].style.backgroundColor = additionalColors[i];
  }
}
renderDefaultColorsBackground();
renderAdditionalColorsBackground();

// set primary or secondary background color when color is selected
[...colorBoxes].forEach((colorBox) =>
  colorBox.addEventListener('click', () => {
    activeColorBox.style.backgroundColor = colorBox.style.backgroundColor;
    fillColor = activeColorBox.style.backgroundColor;
  })
);
primaryColor.addEventListener('click', toggleColors);
secondaryColor.addEventListener('click', toggleColors);

function toggleColors() {
  if (!this.classList.contains('active')) {
    primaryColor.classList.toggle('active');
    secondaryColor.classList.toggle('active');
    activeColorBox = this.querySelector('.color-box');
    fillColor = this.querySelector('.color-box').style.backgroundColor;
  }
}
colorPicker.addEventListener('change', addNewColor);

function addNewColor() {
  if (!colorBoxes[additionalColors.length + 19].classList.contains('active')) {
    colorBoxes[additionalColors.length + 19].classList.add('active');
  }
  additionalColors.push(this.value);

  if (additionalColors.length === 11) {
    // if maximum number of colors reached, shift colors places
    additionalColors.shift();
  }
  renderAdditionalColorsBackground();
}
//////////////////////// drawing ////////////////////////
// draw line and circle at the same time to fix the issue when the mouse is fast

let mouseDown = false;

drawOn();

function drawOn() {
  canvas.addEventListener('mousedown', drawHandler);
}
function drawOff() {
  canvas.removeEventListener('mousedown', drawHandler);
}

function drawHandler(e) {
  mouseDown = true;
  let x = e.offsetX;
  let y = e.offsetY;
  drawCircle(x, y);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', drawMouseUpCheck, { once: true });

  function draw(e2) {
    if (mouseDown) {
      let x2 = e2.offsetX;
      let y2 = e2.offsetY;
      drawLine(ctx, x, y, x2, y2);
      drawCircle(x, y);
      x = x2;
      y = y2;
    }
  }
  function drawMouseUpCheck() {
    canvas.removeEventListener('mousemove', draw);
    mouseDown = false;
  }
}

function drawCircle(x, y) {
  ctx.fillStyle = fillColor;
  ctx.beginPath();
  ctx.arc(x, y, drawSize, 0, 2 * Math.PI);
  ctx.fill();
}

function drawLine(ctx, x, y, x2, y2) {
  ctx.lineWidth = drawSize * 2;
  ctx.strokeStyle = fillColor;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

//////////////////////// shapes ////////////////////////
let shape;
const shapesListBtns = document.querySelectorAll('.panel-shapes-list >div');
shapesListBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    shapesListBtns.forEach((btn) => btn.classList.remove('small-btn-active'));
    shape = btn.getAttribute('shape');
    btn.classList.add('small-btn-active');
    drawShape();
  });
});

function drawShape() {
  let canvas2;
  let ctx2;
  let mouseDown = false;
  let lockX, lockY, x, y;
  drawOff();
  boardContainer.addEventListener('mousedown', handleDrawShape);

  function createNewCanva() {
    let canvasEl = document.createElement('canvas');
    boardContainer.appendChild(canvasEl);
    canvasEl.classList.add('new-layer');
    canvas2 = canvasEl;
    ctx2 = canvas2.getContext('2d');
  }

  function handleDrawShape(e) {
    createNewCanva();
    mouseDown = true;
    lockX =
      e.clientX -
      boardContainer.getBoundingClientRect().left.toFixed() -
      parseInt(getComputedStyle(canvas2).marginLeft);
    lockY =
      e.clientY -
      boardContainer.getBoundingClientRect().top.toFixed() -
      parseInt(getComputedStyle(canvas2).marginTop);

    canvas2.width = 0;
    canvas2.height = 0;

    canvas2.style.left = `${lockX}px`;
    canvas2.style.top = `${lockY}px`;

    if (mouseDown) {
      boardContainer.addEventListener('mousemove', drawShapeResizer);
    }
    boardContainer.addEventListener('mouseup', checkMouseUp, {
      once: true,
    });

    function checkMouseUp() {
      boardContainer.removeEventListener('mousemove', drawShapeResizer);
      mouseDown = false;
    }

    function drawShapeResizer(e2) {
      if (e.target !== canvas2) {
        x =
          e2.clientX -
          boardContainer.getBoundingClientRect().left.toFixed() -
          parseInt(getComputedStyle(canvas2).marginLeft) -
          lockX;
        y =
          e2.clientY -
          boardContainer.getBoundingClientRect().top.toFixed() -
          parseInt(getComputedStyle(canvas2).marginTop) -
          lockY;

        canvas2.width = Math.abs(x);
        canvas2.height = Math.abs(y);
        canvas2.style.transform = '';

        ctx2.lineWidth = drawSize * 2;
        ctx2.strokeStyle = fillColor;
        if (shape == 'circle') {
          drawCircleShape(canvas2, ctx2, x, y);
        } else if (shape == 'line') {
          drawLine(canvas2, ctx2, x, y);
        }
      }
      function drawCircleShape(canvasEl, ctx, x, y) {
        let needRotationX = false;
        let needRotationY = false;

        if (x < 0) {
          needRotationX = true;
        }
        if (y < 0) {
          needRotationY = true;
        }

        x = Math.abs(x);
        y = Math.abs(y);

        let centerX = x / 2;
        let centerY = y / 2;
        let radiusX = x / 2;
        let radiusY = y / 2;

        drawBezierCircle(ctx, centerX, centerY, radiusX, radiusY);
        drawBezierCircle(ctx, centerX, centerY, -radiusX, radiusY);
        drawBezierCircle(ctx, centerX, centerY, radiusX, -radiusY);
        drawBezierCircle(ctx, centerX, centerY, -radiusX, -radiusY);

        function drawBezierCircle(ctx, centerX, centerY, radiusX, radiusY) {
          let magicNumber = 0.552284749831;

          //trying to make it a perfect circle but my brain turned off.
          // let a = 1.00005519;
          // let b = 0.55342686;
          // let c = 0.99873585;
          // Src : https://spencermortensen.com/articles/bezier-circle/

          let start = { x: centerX - radiusX, y: centerY };
          let cp1 = {
            x: centerX - radiusX,
            y: centerY - radiusY * magicNumber,
          };
          let cp2 = {
            x: centerX - radiusX * magicNumber,
            y: centerY - radiusY,
          };
          let end = { x: centerX, y: centerY - radiusY };

          ctx.beginPath();
          ctx.moveTo(start.x, start.y);
          ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y);
          ctx.stroke();

          let scaleX = needRotationX ? -1 : 1;
          let scaleY = needRotationY ? -1 : 1;

          let translateX = needRotationX ? 100 : 0;
          let translateY = needRotationY ? 100 : 0;

          if (needRotationX) {
            canvasEl.style.transform = `scale(${scaleX},${scaleY}) translate(${translateX}%,${translateY}%)`;
          }

          if (needRotationY) {
            canvasEl.style.transform = `scale(${scaleX},${scaleY}) translate(${translateX}%,${translateY}%)`;
          }
        }
      }
      function drawLine(canvasEl, ctx, x, y) {
        let needRotationX = false;
        let needRotationY = false;

        if (x < 0) {
          needRotationX = true;
        }
        if (y < 0) {
          needRotationY = true;
        }

        x = Math.abs(x);
        y = Math.abs(y);

        ctx.lineWidth = drawSize * 2;
        ctx.strokeStyle = fillColor;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(x, y);
        ctx.stroke();

        let scaleX = needRotationX ? -1 : 1;
        let scaleY = needRotationY ? -1 : 1;

        let translateX = needRotationX ? 100 : 0;
        let translateY = needRotationY ? 100 : 0;

        if (needRotationX) {
          canvasEl.style.transform = `scale(${scaleX},${scaleY}) translate(${translateX}%,${translateY}%)`;
        }

        if (needRotationY) {
          canvasEl.style.transform = `scale(${scaleX},${scaleY}) translate(${translateX}%,${translateY}%)`;
        }
      }
    }
  }
}

// const test = document.querySelector('.test');
// const ctxx = test.getContext('2d');
// drawLine(ctxx, 0, 0, 100, 100);
// test.style.transform = 'scale(-1,1) translate(100%)';
// test.style.transform = '';
