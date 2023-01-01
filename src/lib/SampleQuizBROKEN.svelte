<script>
  import { onMount } from "svelte";

  let questions = [
    {
      question: `The radius of a sphere is measured with an uncertainty of 2$\\%$. What is the uncertainty in the volume of the sphere?`,
      answer: `6$\\%$`,
      videoSolution: `https://www.brightowltutoring.com/s/brightowl-preview.mp4`,
      options: [`2$\\%$`, `4$\\%$`, `6$\\%$`, `8$\\%$`],
    },
    {
      question: `The force of air resistance $F$ that acts on a car moving at speed $v$ is given by $F=kv^2$ where $k$ is a constant. What is the unit of $k$?`,
      answer: `kg  m$^{–1}$`,
      videoSolution: `https://download.blender.org/peach/trailer/trailer_400p.ogg`,
      options: [
        `kg  m$^{–1} $`,
        `kg  m$^{–2}$ s$^2$`,
        `kg  m$^{–2}$`,
        `kg  m$^{–2}$ s$^{-2}$`,
      ],
    },
  ];

  let incorrectArrayId = [];
  let submitBtn, clearAbles, clearBtn, solutionsBtn, incorrectsBtn;

  onMount(() => {
    MathJax = {
      loader: {
        load: ["[tex]/physics", "ui/lazy"],
      },
      tex: {
        inlineMath: [
          ["$", "$"],
          ["\\(", "\\)"],
        ],
        packages: {
          "[+]": ["physics"],
        },
      },
      options: {
        renderActions: {
          addMenu: [],
        },
      },
      svg: {
        fontCache: "global",
      },
    };

    // second (and last) global variable ... modified depending on function logic below

    // Submit Button logic
    submitBtn = document.querySelector(".endform-button.btn1");

    submitBtn.addEventListener("click", () => {
      let quizForm = document.forms.namedItem("quiz-form");
      processQuizForm(quizForm)
        ? toggleOn()
        : alert(`Answer all questions, and hit Submit again.`);
      // one of the 'outputs' of processQuizForm(), is to return TRUE given checkedCounter === questions.length

      incorrectArrayId.length = 0;
      // scrollIntoViewSTR('answers');
      window.scrollBy(0, 50);
    });

    // Clear Button logic
    clearAbles = document.querySelectorAll(".clearAble");

    clearBtn = document.querySelector(".endform-button.btn2");
    clearBtn.addEventListener("click", () => {
      scrollIntoViewSTR("00");

      toggleVideoDisplay();

      turnElementOFF(".videoWrapper");
      toggleOff();

      greenUnHighlight();
      redTextUnHighlight();

      clearAbles = [];
      incorrectArrayId.length = 0;

      // randomize and repopulate on every clear
      randomizeOptions();
      fillQuizTemplate();
    });

    // Solutions button logic
    solutionsBtn = document.querySelector("#answers");
    solutionsBtn.addEventListener("click", () => {
      greenHighlight();
      toggleVideoDisplay();
      turnElementON(".videoWrapper");
    });

    // Incorrect solutions button logic
    incorrectsBtn = document.querySelector("#incorrectAnswers");
    incorrectsBtn.addEventListener("click", () => {
      redTextHighlight();
      scrollIntoViewSTR(incorrectArrayId[0]);
    });

    // window.onload = () => {
    // document.body.addEventListener("popstate", () => {
    // createQuizTemplate();
    // randomizeOptions();
    // fillQuizTemplate();
    // });
  });

  function activate() {
    createQuizTemplate();
    randomizeOptions();
    fillQuizTemplate();
  }

  //toggle video logic
  function toggleVideoDisplay() {
    const videoWrapper = document.querySelectorAll(".videoWrapper");
    for (let el of videoWrapper) {
      el.addEventListener("click", () => {
        const video = el.querySelector("VIDEO");

        if (video.style.display == "none") {
          video.style.display = "block";
          video.play();
        } else {
          video.style.display = "none";
          video.pause();
        }
      });
    }
  }

  function createQuizTemplate() {
    const quizLoadedFromJS = document.getElementById(`quizLoadedFromJS`);

    for (let i = 0; i < questions.length; i++) {
      let questionOptionsElement = ``;

      let questionElement = `
            <span id="q${i + 1}" style = "margin-bottom:12px"> </span>
            <span class=" videoWrapper greenBold" style = "display:none" >
              solution video
              <video class="centerMargin videoClass" style="display:none" preload="none" controls controlsList="nodownload"
                onloadstart="this.volume=0.25" src=${
                  questions[i].videoSolution
                }>
                Your browser does not support mp4.
              </video>
            </span>
          `;

      for (let j = 0; j < questions[i].options.length; j++) {
        questionOptionsElement += ` 
              <label class="question-container">
                <input id="${i}${j}" type="radio" name="q${i + 1}" >
                <div> </div>
                <span class="checkmark"></span>
              </label>
            `;
      }
      quizLoadedFromJS.insertAdjacentHTML(
        "beforeend",
        questionElement + questionOptionsElement
      );
    }
  }

  function fillQuizTemplate() {
    for (let i = 0; i < questions.length; i++) {
      document.getElementById(`q${i + 1}`).innerHTML = `<b>Q${i + 1}.</b> ${
        questions[i].question
      }`;

      for (let j = 0; j < questions[i].options.length; j++) {
        let element = document.getElementById(`${i}${j}`),
          elementSibling = element.nextElementSibling,
          elementParentFirst = element.parentElement.firstElementChild;

        elementSibling.innerHTML = questions[i].options[j];

        if (questions[i].options[j] === questions[i].answer) {
          elementParentFirst.className = "correcto";
        } else {
          elementParentFirst.className = "incorrecto";
        }
      }
    }
    MathJax.typeset();
  }

  function processQuizForm(form) {
    let checkedCounter = 0;
    let sumOptionsLength = 0;
    let score = 0;

    // eventually gets the total score
    for (i = 0; i < questions.length; i++) {
      sumOptionsLength += questions[i].options.length;
      let currentElement = sumOptionsLength - questions[i].options.length;

      for (j = 0; j < questions[i].options.length; j++) {
        let current_Selection = form.elements[currentElement + j];
        if (current_Selection.checked) {
          checkedCounter++;

          if (current_Selection.className === "correcto") {
            score++;
            break;
          }
        }
      }
    }
    //these get returned to the "output" method of the given form
    form.mark.value = score;
    form.numQuestions.value = questions.length;

    // this boolean is useful for submit button logic
    return checkedCounter === questions.length;
  }

  /*  start of HOISTED FUNCTIONS ...  */

  function toggleOn() {
    const toggleAble = document.querySelectorAll(".toggleAble");

    for (let el of toggleAble) {
      el.style.display = "inline-block";
    }
  }

  function toggleOff() {
    const toggleAble = document.querySelectorAll(".toggleAble");

    for (let el of toggleAble) {
      el.style.display = "none";
    }
  }

  function greenHighlight() {
    let questionContainers = document.querySelectorAll("LABEL");

    for (let x of questionContainers) {
      let y = x.firstElementChild; // INPUT
      if (y.className === "correcto")
        y.nextElementSibling.style.backgroundColor = "rgb(223, 247, 240)";
    }
  }

  function greenUnHighlight() {
    let questionContainers = document.querySelectorAll("LABEL");

    for (let x of questionContainers) {
      let y = x.firstElementChild; // INPUT
      if (y.className === "correcto")
        y.nextElementSibling.style.backgroundColor = "transparent";
    }
  }

  function redTextHighlight() {
    let questionContainers = document.querySelectorAll("LABEL");

    for (let el of questionContainers) {
      let input = el.firstElementChild;

      if (input.checked === true && input.className === "incorrecto") {
        incorrectArrayId = [...incorrectArrayId, input.id];
        input.nextElementSibling.style.color = "salmon";
      }
    }
  }

  function redTextUnHighlight() {
    let questionContainers = document.querySelectorAll("LABEL");
    for (let el of questionContainers) {
      let input = el.firstElementChild;

      if (input.className === "incorrecto") {
        input.nextElementSibling.style.color = "rgb(56,70,90)";
      }
    }
  }

  function turnElementON(some_str) {
    let classList = document.querySelectorAll(some_str);
    for (let el of classList) {
      el.style.display = "block";
    }
  }

  function turnElementOFF(some_str) {
    let classList = document.querySelectorAll(some_str);
    for (let el of classList) {
      el.style.display = "none";
    }
  }

  function scrollIntoViewSTR(some_str) {
    document.getElementById(some_str).scrollIntoView();
    window.scrollBy(0, -170); //offset correction
  }

  function getRandomIndex(NUM) {
    return Math.floor(NUM * Math.random());
  }

  function randomizePureJS(ARRAY) {
    const initialLen = ARRAY.length;
    let fillingArray = [];

    // fills array via random-depleting of inputted array
    for (let i = initialLen; i > 0; i--) {
      let randomElement = ARRAY[getRandomIndex(i)];

      ARRAY = ARRAY.filter((el) => el != randomElement);
      fillingArray = [...fillingArray, randomElement];
    }
    return fillingArray;
  }

  function randomizeOptions() {
    for (let el of questions) {
      el.options = randomizePureJS(el.options);
    }
  }

  /*  ... end of HOISTED FUNCTIONS */

  // window.onload = () => {
  //   createQuizTemplate();
  //   randomizeOptions();
  //   fillQuizTemplate();
  // };
</script>

<!-- MATHJAX/LATEX CODE FOR WEBSITE -->
<svelte:head>
  <script
    id="MathJax-script"
    async
    src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
  <script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
</svelte:head>

<!-- MATHJAX/LATEX CODE FOR WEBSITE  -->

<button on:click={activate}>activate</button>

<form id="quiz-form">
  <span id="quizLoadedFromJS" />

  <p class="toggleAble greenBold" style="display:none;">
    <output name="mark" /> out of <output name="numQuestions" /> points
  </p>

  <div>
    <input class="endform-button btn1" type="button" value="Submit" />
    <input
      class="toggleAble endform-button btn2"
      type="reset"
      value="Reset"
      style="display:none"
    />
  </div>

  <div>
    <input
      id="incorrectAnswers"
      class="toggleAble clearAble incorrect-ans-button"
      style="display:none"
      type="button"
      value="Show Incorrect"
    />
    <input
      id="answers"
      class="toggleAble clearAble correct-ans-button"
      style="display:none"
      type="button"
      value="Show Solutions"
    />
  </div>
</form>

<style>
  /* .displayOFF{display:none}
    .displayON{display:inline-block} */

  .greenBold {
    /* color:rgb(89,208,174);  */
    /* color: rgba(41, 145, 123, 0.75); */
    color: rgb(13, 199, 168);
    font-weight: bold;
  }
  /* hides the default Details icon */
  details summary {
    list-style: none;
  }

  details summary::-webkit-details-marker {
    display: none;
  }

  /* TODO: currently not being used */
  .centerMargin {
    margin: 0 auto;
  }
  .centerText {
    text-align: center;
  }
  .centerContainer {
    display: flex;
    place-content: center;
    /* justify-content: center; */
  }

  .videoClass {
    width: 50%;
    min-width: 400px;
    display: inline-block;
    /* display: block; */
  }

  .endform-button {
    font-size: 20px;
  }

  .incorrect-ans-button,
  .correct-ans-button {
    font-size: 15px;
  }

  .endform-button,
  .incorrect-ans-button,
  .correct-ans-button {
    color: rgba(41, 95, 145, 0.75);
    background-color: #eee;
    margin: 4px 2px;
    padding: 15px 20px;
    top: 0px;
    border: solid 1px #eee;
    box-shadow: 2px 2px #ddd;
    border-radius: 4px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-weight: bold;
    font-family: "Nunito", sans-serif;
    cursor: pointer;
    transition-duration: 0.2s;
    width: 15vw;
    min-width: 150px;
  }

  .endform-button.btn1:hover {
    background-color: #ddd;
    color: rgb(15, 199, 168);
    font-weight: bold;
  }

  .endform-button.btn2:hover {
    background-color: #ddd;
    color: rgba(41, 95, 145, 1);
    font-weight: bold;
  }

  .incorrect-ans-button:hover {
    background-color: salmon;
    color: white;
    font-weight: bold;
  }

  .correct-ans-button:hover {
    background-color: rgba(41, 145, 123, 0.75);
    color: white;
    font-weight: bold;
  }

  .question-container {
    display: block;
    position: relative;
    padding-left: 35px;
    margin-top: 12px;
    margin-bottom: 12px;
    cursor: pointer;
    font-size: 22px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  /* Hide the browser's default radio button */
  .question-container input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
  }

  /* Create a custom radio button */
  .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 25px;
    width: 25px;
    background-color: #eee;
    border-radius: 50%;
    /*makes the selection circular*/
  }

  /* On mouse-over, add a grey background color */
  .question-container:hover input ~ .checkmark {
    background-color: #aaa;
  }

  /* When the radio button is checked*/
  .question-container input:checked ~ .checkmark {
    background-color: #ccc;
  }

  /* Create the indicator (the dot/circle - hidden when not checked) */
  .checkmark:after {
    content: "";
    position: absolute;
    display: none;
  }

  /* Show the indicator (dot/circle) when checked */
  .question-container input:checked ~ .checkmark:after {
    display: block;
  }

  /* Style the indicator (dot/circle) */
  .question-container .checkmark:after {
    top: 9px;
    left: 9px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: white;
  }
</style>
