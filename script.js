const randomizeBtn = document.querySelector("#randomize");
const randomNumberBox = document.querySelector("#random-number");
const refreshSeatsEl = document.querySelector("#refresh-seats");
const leftSeatsEl = document.querySelector('.left-seats .seats');
const rightSeatsEl = document.querySelector('.right-seats .seats');

const leftSeats = 20;
const rightSeats = 15;
const totalSeat = leftSeats + rightSeats; // 1 to 35
const keyPrefix = "PPTI22_ARRADIUS";

function createSeats(numberOfSeats, positionEl, startAt){
    for(let i = 0; i < numberOfSeats; i++){
        const el = document.createElement('div');
        el.classList.add("seat");
        el.dataset.number = startAt + i;
        el.innerHTML = startAt + i;
        positionEl.append(el);
    }
}

function highlightOccupiedSeats(){
    const data = JSON.parse(localStorage.getItem(`${keyPrefix}_RANDOMIZED`) ?? '[]');
    data.forEach(number => {
        const seatEl = document.querySelector(`.seat[data-number='${number}']`);
        seatEl?.classList.add('seat-occupied');
    });
}

function initializeSeats(){
    createSeats(leftSeats, leftSeatsEl, 1);
    createSeats(rightSeats, rightSeatsEl, leftSeats + 1);
    highlightOccupiedSeats();
}

function generateRandom(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function setLocalStorage(item) {
	const data = JSON.parse(
		localStorage.getItem(`${keyPrefix}_RANDOMIZED`) ?? "[]"
	);
	data.push(item);
	localStorage.setItem(`${keyPrefix}_RANDOMIZED`, JSON.stringify(data));
}

function checkForExistence(number) {
	const data = JSON.parse(
		localStorage.getItem(`${keyPrefix}_RANDOMIZED`) ?? "[]"
	);
	const exists = data.find((num) => num == number);
	return exists;
}

async function shuffle() {
	let maxTime = 1000;
	let timeElapsed = 0;
	return new Promise((resolve) => {
		let interval = setInterval(() => {
			if (timeElapsed >= maxTime) {
				clearInterval(interval);
				resolve();
				return;
			}
			let random = generateRandom(1, totalSeat);
			randomNumberBox.innerHTML = random;
			timeElapsed += 50;
		}, 50);
	});
}

function occupySeat(number) {
	const seat = document.querySelector(`.seat[data-number='${number}']`);
	seat.classList.add("seat-occupied");
}


// flow

initializeSeats();
randomizeBtn.addEventListener("click", async function () {
	let randomNumber;
	do {
		randomNumber = generateRandom(1, totalSeat);
	} while (checkForExistence(randomNumber));

	await shuffle();
	randomNumberBox.innerHTML = randomNumber;
	occupySeat(randomNumber);
	setLocalStorage(randomNumber);
});

refreshSeatsEl.addEventListener("click", function () {
	localStorage.removeItem(`${keyPrefix}_RANDOMIZED`);
	document.querySelectorAll(".seat").forEach((el) => {
		el.classList.remove("seat-occupied");
	});
});
