function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      $(".image-upload-wrap").hide();

      $(".file-upload-image").attr("src", e.target.result);
      $(".file-upload-content").show();

      $(".image-title").html(input.files[0].name);
    };

    reader.readAsDataURL(input.files[0]);
  } else {
    removeUpload();
  }
}

function removeUpload() {
  $(".file-upload-input").replaceWith($(".file-upload-input").clone());
  $(".file-upload-content").hide();
  $(".image-upload-wrap").show();
}
$(".image-upload-wrap").bind("dragover", function () {
  $(".image-upload-wrap").addClass("image-dropping");
});
$(".image-upload-wrap").bind("dragleave", function () {
  $(".image-upload-wrap").removeClass("image-dropping");
});

// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

// the link to your model provided by Teachable Machine export panel
const URL = "./PBCmodel/";

let model, webcam, labelContainer, maxPredictions;

// Load the image model and setup the webcam
async function init() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  // load the model and metadata
  // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
  // or files from your local hard drive
  // Note: the pose library adds "tmImage" object to your window (window.tmImage)
  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();
  // 웹캠쓸 때 사용되는 부분.
  // Convenience function to setup a webcam
  // const flip = true;

  // webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
  // await webcam.setup(); // request access to the webcam
  // await webcam.play();
  // window.requestAnimationFrame(loop);

  // append elements to the DOM

  labelContainer = document.getElementById("label-container");

  labelContainer.appendChild(document.createElement("div"));
}

//웹캠 안쓸 거라서 주석처리함.
//     async function loop() {
//         webcam.update(); // update the webcam frame
//         await predict();
//         window.requestAnimationFrame(loop);
//     }

// run the webcam image through the image model
async function predict() {
  // predict can take in an image, video or canvas html element
  var image = document.getElementById("pet-image");
  var prediction = await model.predict(image, false);
  console.log(prediction);
  findTopPrediction(prediction);
}

const modelData = {
  Beagle:
    "비글은 개 품종의 하나이다. 외모는 억세어 보이며, 몸에 군더더기 살이 없고, 짧은 털이 빽빽하게 나 있다. 머리는 넓적하고, 귀는 부드러우며 길쭉하다. 체중은 약 8~14kg이다.",
};

function findTopPrediction(predictionObj) {
  let topProbability = predictionObj[0].probability.toFixed(2);
  let topPrectionIndex = 0;

  for (let i = 1; i < maxPredictions; i++) {
    if (topProbability < predictionObj[i].probability.toFixed(2)) {
      topProbability = predictionObj[i].probability.toFixed(2);
      topPrectionIndex = i;
    }
  }

  // 예측한 애완동물
  var predictPet = predictionObj[topPrectionIndex].className;

  const classPrediction = `
    <p style="font-weight:bold; font-size: x-large">
    사진의 애완동물은 ${predictPet} 입니다!
    </p> 
    <p>${modelData[predictPet]}</p>`;

  labelContainer.childNodes[0].innerHTML = classPrediction;
}
