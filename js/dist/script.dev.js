"use strict";

var ActualImg = document.getElementById('ActualImg');
var resizeButton = document.getElementById('resizeButton');
var infoID = document.getElementById('infoID');
var imgCard = document.getElementById('imgCard');
var mainImg = document.getElementById("main_header_img");
var mainForm = document.getElementById("main_form");
var fileName = document.getElementById("fileName");
var downloadButton = document.getElementById("downloadButton");
var uploadRoot = document.getElementById("uploadRoot");
var imgDom = '';
var imgSize = [192, 180, 144, 128, 120, 96];

function uploadImg() {
  readURL(this);
}

;

function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      var img = document.createElement("img");

      img.onload = function (e) {
        window.URL.revokeObjectURL(img.src); // 清除釋放
      };

      var src = e.target.result;
      img.src = src;
      img.setAttribute("id", "orig_img");
      mainImg.appendChild(img);
    };

    fileName.textContent = input.files[0].name;
    reader.readAsDataURL(input.files[0]);
  }
}

;

function OrigImg() {
  var orig_src = document.getElementById('orig_img');

  if (!infoID.value) {
    alert("請輸入站點ID");
  } else if (!orig_src) {
    alert("請上傳圖片");
  } else if (orig_src.width < imgSize[0] || orig_src.height < imgSize[0]) {
    console.log('orig_src.width', orig_src.width, 'imgSize[0]', imgSize[0]);
    alert("\u5716\u7247\u5C3A\u5BF8\u932F\u8AA4\uFF0C\u8ACB\u4E0A\u50B3".concat(imgSize[0], "x").concat(imgSize[0], "\u4EE5\u4E0A\u7684\u5716\u7247"));
    resetRender();
    mainForm.reset();
  } else {
    renderImg(orig_src);
  }
}

function renderImg(orig_src) {
  for (var i = 0; i < imgSize.length; i++) {
    if (imgSize[i] === 128) {
      imgDom += "\n                <div class=\"img img_".concat(i + 1, "\">\n                    <h3>").concat(imgSize[i], " x ").concat(imgSize[i], "</h3>\n                    <div class=\"img_img\">\n                        <img src=\"\" alt=\"\" id=\"resizeImg").concat(i + 1, "\">\n                    </div>\n                    <p id=\"iconName").concat(i + 1, "\">app_icon_").concat(infoID.value, ".png</p>\n                </div>\n            ");
    } else {
      imgDom += "\n                <div class=\"img img_".concat(i + 1, "\">\n                    <h3>").concat(imgSize[i], " x ").concat(imgSize[i], "</h3>\n                    <div class=\"img_img\">\n                        <img src=\"\" alt=\"\" id=\"resizeImg").concat(i + 1, "\">\n                    </div>\n                    <p id=\"iconName").concat(i + 1, "\">app_icon_").concat(imgSize[i], "x").concat(imgSize[i], ".png</p>\n                </div>\n            ");
    }
  }

  imgCard.innerHTML = imgDom;

  for (var i = 0; i < imgSize.length; i++) {
    var resizeImg = document.getElementById("resizeImg".concat(i + 1));
    resizeImage(imgSize[i], imgSize[i], orig_src, resizeImg);
  }
}

function resizeImage(width, height, orig_src, resizeImg) {
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d"); // ctx.imageSmoothingEnabled = false;

  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(orig_src, 0, 0, width, height);
  var dataURL = canvas.toDataURL('image/png');
  resizeImg.setAttribute('src', dataURL);
}

;

function resetRender() {
  mainForm.reset();
  mainImg.textContent = "";
  imgCard.textContent = "";
  imgDom = "";
  infoID.value = "";
}

;

function downloadZip() {
  var zip = new JSZip();
  var src = '';

  for (var i = 0; i < imgSize.length; i++) {
    src = document.getElementById("resizeImg".concat(i + 1)).getAttribute('src').replace("data:image/png;base64,", "");
    ;
    name = document.getElementById("iconName".concat(i + 1)).textContent;
    zip.file(name, src, {
      base64: true
    });
  }

  zip.generateAsync({
    type: "blob"
  }).then(function (content) {
    saveAs(content, "".concat(infoID.value, "\u7AD9\u9EDEAPP ICON"));
  });
}

;

function onDragEnter(e) {
  e.stopPropagation(); //終止事件冒泡

  e.preventDefault(); //終止預設行為

  uploadRoot.classList.add('upload--active');
}

function onDragOver(e) {
  e.stopPropagation(); //終止事件冒泡

  e.preventDefault(); //終止預設行為

  return false;
}

function onDragLeave() {
  uploadRoot.classList.remove('upload--active');
  return false;
}

function onDrop(e) {
  e.stopPropagation(); //終止事件冒泡

  e.preventDefault(); //終止預設行為

  var files = e.dataTransfer;
  readURL(files);
  uploadRoot.classList.remove('upload--active');
}

ActualImg.addEventListener('change', uploadImg);
resizeButton.addEventListener('click', OrigImg);
downloadButton.addEventListener('click', downloadZip);
window.addEventListener("dragenter", onDragEnter);
window.addEventListener('dragover', onDragOver);
;
uploadRoot.addEventListener("dragleave", onDragLeave);
window.addEventListener("drop", onDrop);