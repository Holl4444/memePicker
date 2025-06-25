import { catsData } from '/data.js';

const emotionRadios = document.getElementById('emotion-radios');
const getImageBtn = document.getElementById('get-image-btn');
const gifsOnlyOption = document.getElementById('gifs-only-option');
const singleImgOption = document.getElementById('single-img-option');
const memeModalInner = document.getElementById('meme-modal-inner');
const memeModal = document.getElementById('meme-modal');
const memeModalCloseBtn = document.getElementById(
  'meme-modal-close-btn'
);
const main = document.getElementById('main');
const spacer = document.getElementById('spacer');

emotionRadios.addEventListener('change', highlightCheckedOption);

// Enable clicking outside popup to close by preventing propagation to window
getImageBtn.addEventListener('click', function (e) {
  e.stopPropagation();
  if (singleImgOption.checked) {
    console.log('single');
    renderCat();
    return;
  }
  renderMatchingCats();
});

memeModalCloseBtn.addEventListener('click', closeModal);

// Clicking outside the pop-up also closes it.
window.addEventListener('click', function (e) {
  if (
    !memeModal.contains(e.target) &&
    memeModal.style.display === 'flex'
  ) {
    closeModal();
  }
});

function closeModal() {
  memeModal.style.display = 'none';
  memeModalInner.style.display = 'none';
  spacer.style.height = '0';
  document.body.style.paddingBottom = '0';
  main.style.visibility = 'visible';
}

function highlightCheckedOption(e) {
  const radios = document.getElementsByClassName('radio');
  for (let radio of radios) {
    radio.classList.remove('highlight');
  }
  document
    .getElementById(e.target.id)
    .parentElement.classList.add('highlight');
}

function getMatchingCatsArray() {
  if (document.querySelector('input[type="radio"]:checked')) {
    const selectedEmotion = document.querySelector(
      'input[type="radio"]:checked'
    ).value;
    const isGif = gifsOnlyOption.checked;

    const matchingCatsArray = catsData.filter(function (cat) {
      if (isGif) {
        return cat.emotionTags.includes(selectedEmotion) && cat.isGif;
      } else {
        return cat.emotionTags.includes(selectedEmotion);
      }
    });
    return matchingCatsArray;
  }
}

function getSingleCatObject() {
  const catsArray = getMatchingCatsArray();

  if (catsArray.length === 1) {
    return catsArray[0];
  } else {
    const randomNumber = Math.floor(Math.random() * catsArray.length);
    return catsArray[randomNumber];
  }
}

function renderCat() {
  const catObject = getSingleCatObject();
  memeModalInner.innerHTML = `
        <img 
        class="cat-img" 
        src="/images/${catObject.image}"
        alt="${catObject.alt}"
        >
        `;
  memeModal.style.display = 'flex';
  memeModalInner.style.display = 'flex';
  spacer.style.height = '8rem';
  document.body.style.paddingBottom = '8rem';
  main.style.visibility = 'hidden';
}

function renderMatchingCats() {
  const catArray = getMatchingCatsArray();
  let innerHTMLString = '';
  catArray.forEach((cat) => {
    innerHTMLString += `
        <img 
            class='cat-img'
            src="/images/${cat.image}"
            alt="${cat.alt}"
            width="150"
            height="150"
        >`;
  });
  memeModalInner.innerHTML = innerHTMLString;
  memeModalInner.setAttribute(
    'style',
    'padding: 3rem 0.5rem; display: flex; gap: 5px; flex-wrap: wrap; justify-content: center; align-items: center;'
  );
  memeModal.setAttribute(
    'style',
    'display: flex; margin-bottom: 2rem;'
  );
  main.style.visibility = 'hidden';
  spacer.style.height = '8rem';
  document.body.style.paddingBottom = '8rem';
}

function getEmotionsArray(cats) {
  const emotionsArray = [];
  for (let cat of cats) {
    for (let emotion of cat.emotionTags) {
      if (!emotionsArray.includes(emotion)) {
        emotionsArray.push(emotion);
      }
    }
  }
  return emotionsArray;
}

function renderEmotionsRadios(cats) {
  let radioItems = ``;
  const emotions = getEmotionsArray(cats);
  for (let emotion of emotions) {
    radioItems += `
        <div class="radio">
            <label for="${emotion}">${emotion}</label>
            <input
            type="radio"
            id="${emotion}"
            value="${emotion}"
            name="emotions"
            >
        </div>`;
  }
  emotionRadios.innerHTML = radioItems;
}

renderEmotionsRadios(catsData);
