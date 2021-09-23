const inputs = document.querySelectorAll('.filters input');
const outputs = document.querySelectorAll('.filters output');
const btns = document.querySelectorAll('.btn');
const resetBtn = document.querySelector('.btn-reset');
const nextBtn = document.querySelector('.btn-next');
const loadBtn = document.querySelector('.btn-load');
const saveBtn = document.querySelector('.btn-save');
const image = document.getElementById('image');
const fileInput = document.querySelector('input[type="file"]');
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const date = new Date();

// Сброс активных кнопок
function resetBtns() {
    for (let elem of btns)
        elem.classList.remove('btn-active');
}

function drawImage() {
    const img = new Image();
    img.setAttribute('crossOrigin', 'anonymous'); 
    img.src = image.src;
    img.onload = function() {
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const imgHeightScale = image.naturalHeight / image.height;
        const ctx = canvas.getContext("2d");
        ctx.filter = `blur(${Math.floor(inputs[0].value * imgHeightScale)}px) invert(${inputs[1].value}%) sepia(${inputs[2].value}%) saturate(${inputs[3].value}%) hue-rotate(${inputs[4].value}deg)`;
        ctx.drawImage(img, 0, 0, img.width, img.height);
    };  
}
drawImage();

// Переключение нового изображения
function setNewImage(){
    resetBtns();
    nextBtn.classList.add('btn-active');
    const time = date.getHours() < 6 ? 'night': date.getHours() < 12 ? 'morning': date.getHours() < 18 ? 'day' : 'evening';
	const currentImage = image.attributes.src.value.slice(-7);
	if (currentImage == 'img.jpg' || currentImage.slice(-6,-4)==20)
    	image.src = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${time}/01.jpg`;
	else if (currentImage.slice(-6,-4)<20) {
		const currentImageNumber = +currentImage.slice(-6,-4);
		const nextImageNumber = (currentImageNumber)<9? '0'+(currentImageNumber+1): currentImageNumber+1;
		image.src = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${time}/${nextImageNumber}.jpg`;
	} else image.src = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${time}/01.jpg`;
    drawImage();
}

// Установка начальных значений
function setStartProperty(){
	inputs.forEach(input => {
		const suffix = input.dataset.sizing;
		document.documentElement.style.setProperty(`--${input.name}`, input.value + suffix);
	})
}

// Сброс значений фильтра
function resetProperty() {
    resetBtns();
    resetBtn.classList.add('btn-active');
    inputs.forEach(input => {
    	input.addEventListener('input', setStartProperty)
    	input["name"]=="saturate" ? input.value=100:input.value=0;
    	outputs.forEach(output => {
    		if (output["name"]==input["name"])
    			output.value = input.value;
   		})
      	document.documentElement.style.setProperty(`--${input["name"]}`, input.value + input["data-sizing"]);
    });
    drawImage();
}

// Функция для установки фильтра
function handleUpdate() {
    const suffix = this.dataset.sizing;
    document.documentElement.style.setProperty(`--${this.name}`, this.value + suffix);
    outputs.forEach(output => {
    	if (output["name"]==this.name) {
            output.value = this.value;
        }	
    })
    drawImage();
}
// Функция загрузки файла

function downloadImage (event){
    
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = () => {
        image.src = reader.result;
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);
        drawImage();
    }
    reader.readAsDataURL(file);
    fileInput.value = "";
    resetBtns();
    loadBtn.classList.add('btn-active');
};

// Функция длля сохранения файла
function saveImage(){
    resetBtns();
    saveBtn.classList.add('btn-active');
    const link = document.createElement('a');
    link.download = 'download.png';
    link.href = canvas.toDataURL();
    link.click();
    link.delite;
}

saveBtn.addEventListener('click', saveImage);
fileInput.addEventListener('change', downloadImage);
resetBtn.addEventListener('mousedown', resetProperty);
nextBtn.addEventListener('mousedown', setNewImage);
inputs.forEach(input => input.addEventListener('input', handleUpdate));

