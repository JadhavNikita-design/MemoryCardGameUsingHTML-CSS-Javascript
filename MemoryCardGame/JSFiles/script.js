const cards = document.querySelectorAll('.card');
let matchedCard = 0;
let cardOne, cardTwo;
let disableDeck = false;
let flipCount = 0;
let timerInterval;
let minutes = 0, seconds = 0;

// Preload images
function preloadImages() {
    const images = [];
    for (let i = 1; i <= 8; i++) {
        images.push(`Images/img${i}.jpg`);
    }

    // Preload all images to ensure they are loaded
    images.forEach((src) => {
        const img = new Image();
        img.src = src;
    });
}

// Start the timer
function startTimer() {
    timerInterval = setInterval(() => {
        seconds++;
        if (seconds === 60) {
            seconds = 0;
            minutes++;
        }
        document.getElementById("timer").textContent = `${formatTime(minutes)}:${formatTime(seconds)}`;
    }, 1000);
}

// Format time for two digits
function formatTime(time) {
    return time < 10 ? `0${time}` : time;
}

// Shuffle the cards on page load
function shuffleCard() {
    matchedCard = 0;
    cardOne = cardTwo = '';
    disableDeck = false;
    flipCount = 0;
    minutes = 0;
    seconds = 0;
    document.getElementById("flip-count").textContent = flipCount;
    document.getElementById("timer").textContent = "00:00";

    let arr = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8];
    arr.sort(() => Math.random() > 0.5 ? 1 : -1);

    cards.forEach((card, i) => {
        card.classList.remove('flip');
        let imgTag = card.querySelector('.back-view img');
        imgTag.src = `Images/img${arr[i]}.jpg`;

        // Add error handling for missing images
        imgTag.onerror = () => {
            imgTag.src = 'Images/placeholder.jpg'; // Set a fallback image
        };

        card.addEventListener('click', flipCard); // Ensure event listener is added on shuffle
    });

    startTimer(); // Start timer once cards are shuffled
}

function flipCard(e) {
    let clickedCard = e.target.closest('.card'); // Get the closest card

    if (clickedCard !== cardOne && !disableDeck) {
        clickedCard.classList.add('flip');
        flipCount++;
        document.getElementById("flip-count").textContent = flipCount;

        if (!cardOne) {
            return (cardOne = clickedCard);
        }

        cardTwo = clickedCard;
        disableDeck = true;

        let cardOneImg = cardOne.querySelector('img').src,
            cardTwoImg = cardTwo.querySelector('img').src;

        matchCards(cardOneImg, cardTwoImg);
    }
}

function matchCards(img1, img2) {
    if (img1 === img2) {
        matchedCard++;

        if (matchedCard === 8) {
            clearInterval(timerInterval); // Stop timer once all pairs are matched
            setTimeout(() => {
                alert(`You won! Time: ${document.getElementById("timer").textContent}, Flips: ${flipCount}`);
                shuffleCard(); // Restart the game after 1 second
            }, 1000);
        }

        cardOne.removeEventListener('click', flipCard);
        cardTwo.removeEventListener('click', flipCard);
        cardOne = cardTwo = '';
        disableDeck = false;
    } else {
        setTimeout(() => {
            cardOne.classList.add('shake');
            cardTwo.classList.add('shake');
        }, 400);

        setTimeout(() => {
            cardOne.classList.remove('shake', 'flip');
            cardTwo.classList.remove('shake', 'flip');

            cardOne = cardTwo = '';
            disableDeck = false;
        }, 1200);
    }
}

// Preload images before starting the game
preloadImages();

// Shuffle and start the game
shuffleCard();
