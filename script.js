// script.js

const img = new Image(); // used to load image from <input> and draw to canvas

//getting the buttons
let generate_meme = document.getElementById('generate-meme');
let generate_bt = document.getElementsByTagName("button")[0];
let reset_bt = document.getElementsByTagName("button")[1];
let read_bt = document.getElementsByTagName("button")[2];
let text_language;
let text_volumn = 1;
let voices = [];

//getting the canvas
let canvas = document.getElementById('user-image');
let ctx = canvas.getContext('2d');

speechSynthesis.addEventListener("voiceschanged", () => {
   voices = speechSynthesis.getVoices();
   //loading the voices options.
   let voices_Selections= document.getElementById("voice-selection");
   voices_Selections.innerHTML="";
   for(let i = 0; i < voices.length ; i++) {
      let option = document.createElement('option');
      option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

    if(voices[i].default) {
      option.textContent += ' -- DEFAULT';
    }

    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    voices_Selections.appendChild(option);
  }
  voices_Selections.disabled = false;
  text_language = voices[0];//default langugage for the text;

  //select the language for the text
  voices_Selections.addEventListener("change", ()=>{
        let choice = voices_Selections.selectedOptions[0].getAttribute('data-name');
        for(i = 0; i < voices.length ; i++) {
          if(voices[i].name === choice) {
            console.log(choice);
            text_language = voices[i];
          }
        }
  });

})


// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
  // TODO
  //clear the canvas

  ctx.clearRect(0,0,400,400);

  //clear the form
  let top_text = document.getElementById('text-top');
  let bottom_text = document.getElementById("text-bottom");
  top_text.value="";
  bottom_text.value="";

  //toggling buttons
  generate_bt.disabled = false;
  reset_bt.disabled = true;
  read_bt.disabled = true;

  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
  ctx.fillStyle="black";
  ctx.fillRect(0,0,400,400);

  let images_D = getDimmensions(400,400,img.width,img.height);
  ctx.drawImage(img,images_D.startX,images_D.startY,images_D.width,images_D.height);

  // Some helpful tips:
  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
  // - Clear the form when a new image is selected
  // - If you draw the image to canvas here, it will update as soon as a new image is selected
});

//image-input
let image_input = document.getElementById("image-input");
image_input.addEventListener('change',()=>{
  console.log('b');
    //img.src=image_input.value;
    let filepath = URL.createObjectURL(image_input.files[0]);
  //  console.log(image_input.files[0]);
    let splits = filepath.split("\\");
    img.src = filepath;
    img.alt= splits[splits.length-1];
});


 generate_meme.addEventListener('submit',(e)=>
 {

  //ctx.clearRect(0, 0, canvas.width, canvas.height);

    e.preventDefault();
   let top_text = document.getElementById('text-top');
   let bottom_text = document.getElementById("text-bottom");
      ctx.font = "18px arial";
      ctx.strokeStyle = "black";
      ctx.fillStyle = "white";
     ctx.textAlign = 'center';
      //ctx.fillText(top_text.value,200,30);
      //ctx.fillText(bottom_text.value,200,390);

      ctx.strokeText(top_text.value,200,20);
     // ctx.strokeText(bottom_text.value,200,img.height-100);
     ctx.strokeText(bottom_text.value,200,395);
      ctx.fillText(top_text.value,200,20);
      //ctx.fillText(bottom_text.value,200,img.height-110);
      ctx.fillText(bottom_text.value,200,395);

      reset_bt.disabled = false;
      read_bt.disabled = false;
})

reset_bt.addEventListener('click',()=>{
  let top_text = document.getElementById('text-top');
   let bottom_text = document.getElementById("text-bottom");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  top_text.value="";
  bottom_text.value="";
})




/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;
  
  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}


//read text
read_bt.addEventListener('click', ()=>{
    let top_text = document.getElementById('text-top');
    let bottom_text = document.getElementById("text-bottom");
    let utterance = new SpeechSynthesisUtterance(top_text.value+" , "+bottom_text.value);
    utterance.volume = text_volumn;
    utterance.voice = text_language;
    console.log(text_language);
    speechSynthesis.speak(utterance);
});

//Volumn change
let voice_bar = document.getElementsByTagName("input")[3];
voice_bar.addEventListener("input", ()=>{
  text_volumn = voice_bar.value/100;
  
  let vol_icon = document.getElementsByTagName('img')[0];
  if(voice_bar.value == 0){
    vol_icon.src="icons/volume-level-0.svg";
    vol_icon.alt="Volume Level 0";
  }else if(voice_bar.value>=1 && voice_bar.value<=33){
    vol_icon.src="icons/volume-level-1.svg";
    vol_icon.alt="Volume Level 1";
  }else if(voice_bar.value>=34 && voice_bar.value<=66){
    vol_icon.src="icons/volume-level-2.svg";
    vol_icon.alt="Volume Level 2";
  }else if(voice_bar.value>=67 && voice_bar.value<=100){
    vol_icon.src="icons/volume-level-3.svg";
    vol_icon.alt="Volume Level 3";
  }

  /*
  let utterance = new SpeechSynthesisUtterance("Hello world!");
  utterance.volume = voice_bar.value/100;
  speechSynthesis.speak(utterance);
  console.log(voice_bar.value/100);
  */
});
