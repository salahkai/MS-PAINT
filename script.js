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

const brushesSelectBtn = document.querySelector('.panel-brushes-selection');
const brushesSelectionMenu = document.querySelector(
  '.panel-brushes-selection-menu'
);
const panelBrushes = document.querySelector('.panel-brushes');
const brushesSelectionList = brushesSelectionMenu.children;
const brushesBg = brushesSelectBtn.querySelector('.box');

const shapesListBtns = document.querySelectorAll('.panel-shapes-list > div');

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
let drawSize = 2;

// selected color ( color one or two)
let activeColorBox = primaryColorBox;
let brush = 1;
////////////////////// Popups///////////////////////

function showPopUp(poppedUpEl, popUpBtn, wholeEl) {
  poppedUpEl.classList.toggle('hidden');
  popUpBtn.classList.toggle('active');
  window.addEventListener(
    'click',
    closePupUpOutside.bind(this, wholeEl, poppedUpEl, popUpBtn)
  );
}
function closePopUp(poppedUpEl, popUpBtn) {
  poppedUpEl.classList.toggle('hidden');
  popUpBtn.classList.toggle('active');
  window.removeEventListener('click', closePupUpOutside);
}
// close popup when click outside the box
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
  showPopUp(lineWidthSelectionMenu, lineWidthSelectBtn, panelSizes);
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

//////////////////////// Brushes ////////////////////////

brushesSelectBtn.addEventListener('click', () => {
  drawShapeOff();
  drawOn();
  showPopUp(brushesSelectionMenu, brushesSelectBtn, panelBrushes);
});

[...brushesSelectionList].forEach((option, i) => {
  option.addEventListener('click', () => {
    changeBrush(i + 1);
    closePopUp(brushesSelectionMenu, brushesSelectBtn);
  });
});

function changeBrush(b) {
  drawShapeOff();
  drawOn();
  brushesBg.style.backgroundImage = `url(./icons/brushes/${b}.png)`;
  brush = b;
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
  if (brush == 1) {
    drawCircle(x, y, drawSize, 1);
  }
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', drawMouseUpCheck, { once: true });

  function draw(e2) {
    if (mouseDown) {
      if (brush == 1) {
        let x2 = e2.offsetX;
        let y2 = e2.offsetY;
        drawLine(ctx, x, y, x2, y2, drawSize, 1);
        drawCircle(x, y, drawSize, 1);
        x = x2;
        y = y2;
      } else if (brush == 2) {
        let x2 = e2.offsetX;
        let y2 = e2.offsetY;
        let random1;
        let random2;

        for (let i = 0; i < 10; i++) {
          random1 = Math.floor(Math.random() * drawSize * 3 + 1);
          random2 = Math.floor(Math.random() * drawSize * 2 + 1);
          drawCircle(x - random1, y - random2, 1, 1);
        }
        x = x2;
        y = y2;
      }
    }
  }
  function drawMouseUpCheck() {
    canvas.removeEventListener('mousemove', draw);
    mouseDown = false;
  }
}

function drawCircle(x, y, size, opacity) {
  ctx.fillStyle = fillColor;
  ctx.beginPath();
  ctx.globalAlpha = opacity;
  ctx.arc(x, y, size, 0, 2 * Math.PI);
  ctx.fill();
}

function drawLine(ctx, x, y, x2, y2, size, opacity) {
  ctx.lineWidth = size * 2;
  ctx.strokeStyle = fillColor;
  ctx.globalAlpha = opacity;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

//////////////////////// shapes ////////////////////////
let isDrawShape = false;
let shape;
shapesListBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    shapesListBtns.forEach((btn) => btn.classList.remove('small-box-active'));
    shape = btn.getAttribute('shape');
    btn.classList.add('small-box-active');
    isDrawShape = true;
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
    if (isDrawShape) {
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
}

function drawShapeOff() {
  isDrawShape = false;
}
// const test = document.querySelector('.test');
// const ctxx = test.getContext('2d');
// drawLine(ctxx, 0, 0, 100, 100);
// test.style.transform = 'scale(-1,1) translate(100%)';
// test.style.transform = '';
