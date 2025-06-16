const submitForm = document.querySelector("#submit-form");
submitForm.addEventListener("submit", (e) => e.preventDefault());

const randomizeBtns = document.querySelectorAll(".randomize-btn");
const refreshSeatsEl = document.querySelector("#refresh-seats");
const leftSeatsEl = document.querySelector(".left-seats .seats");
const rightSeatsEl = document.querySelector(".right-seats .seats");
const userNameEl = document.querySelector("#user-name");
const remainingSeats = document.querySelector("#nav-remaining span");

// random number type
const randomNumberDice = document.querySelector("#random-number-dice");
const randomNumberCasino = document.querySelector("#random-number-casino");
const randomNumberCasinoBtn = randomNumberCasino.querySelector(".random-number-casino-pull .randomize-btn");

let remaining = 0;

const leftSeatsMap = [
	"",
	"",
	"",
	"",
	"s",
	"s",
	"s",
	"",
	"",
	"",
	"s",
	"s",
	"s",
	"s",
]; // 18

const rightSeatsMap = [
	"s",
	"s",
	"s",
	"s",
	"s",
	"s",
	"s",
	"s",
	"s",
	"s",
	"s",
	"s",
	"s",
	"s",
	"s",
	"s",
	"s",
	"s",
	"s",
	"s",
	"s",
	"s",
	"s",
	"s",
	"s",
	"s",
	"s",
	"s",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
]; // 17

const leftSeats = leftSeatsMap.filter((e) => e != "").length;
const rightSeats = rightSeatsMap.filter((e) => e != "").length;
const totalSeats = leftSeats + rightSeats; // 1 to 35

const keyPrefix = "PPTI22_ARRADIUS";

let config = {
	"seat-type" : "square",
	"seat-randomer" : "casino"
}

function updateRemainingSeats(){
	remaining = 0;
	document.querySelectorAll(".seat").forEach((el) => {
		if(!el.classList.contains("seat-occupied")){
			remaining++;
		}
	});
	remainingSeats.textContent = remaining;
}

function createSequenceOfNumbers(start, numbers) {
	return new Array(numbers).fill(0).map((_, i) => i + start);
}

function createSeats(numberOfSeats, positionEl, startAt) {
	for (let i = 0; i < numberOfSeats; i++) {
		const el = document.createElement("div");
		const nameEl = document.createElement("div");
		el.classList.add("seat");
		nameEl.innerHTML = "<p class='red'>NONE</p>";
		nameEl.classList.add("name");
		el.dataset.number = startAt + i;
		el.textContent = startAt + i;
		el.append(nameEl);
		positionEl.append(el);
	}
}

function createSeatsFromMap(map, positionEl, startAt) {
	let orderCount = 0;
	map.forEach((e) => {
		const el = document.createElement("div");

		el.classList.add("seat-box");
		if (e == "s") {
			const nameEl = document.createElement("div");
			nameEl.innerHTML = "<p class='red'>NONE</p>";
			nameEl.classList.add("name");
			el.classList.add("seat");
			el.dataset.number = startAt + orderCount;
			el.textContent = startAt + orderCount++;
			el.append(nameEl);
		}

		positionEl.append(el);
	});
}

function highlightOccupiedSeats() {
	const data = JSON.parse(
		localStorage.getItem(`${keyPrefix}_RANDOMIZED`) ?? "{}"
	);
	// end
	Object.keys(data).forEach((number) => {
		const seatEl = document.querySelector(`.seat[data-number='${number}']`);
		const seatNameEl = seatEl.querySelector(".name");
		seatNameEl.textContent = data[number];
		seatEl?.classList.add("seat-occupied");
		removeNumberFromArray(number);
		addBall();
	});
	updateRemainingSeats();
}

function initializeSeats() {
	// createSeats(leftSeats, leftSeatsEl, 1);
	// createSeats(rightSeats, rightSeatsEl, leftSeats + 1);
	createSeatsFromMap(leftSeatsMap, leftSeatsEl, 1);
	createSeatsFromMap(rightSeatsMap, rightSeatsEl, leftSeats + 1);
	highlightOccupiedSeats();
	updateRemainingSeats();
}

function generateRandom(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomFromArray(array) {
	return array[~~(Math.random() * array.length)];
}

function setSeatToLocalStorage(item) {
	const data = JSON.parse(
		localStorage.getItem(`${keyPrefix}_RANDOMIZED`) ?? "{}"
	);

	data[item] = userNameEl.value;
	localStorage.setItem(`${keyPrefix}_RANDOMIZED`, JSON.stringify(data));
}

function checkForExistence(number) {
	const data = JSON.parse(
		localStorage.getItem(`${keyPrefix}_RANDOMIZED`) ?? "{}"
	);
	const exists = Object.keys(data).find((num) => num == number);
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
			let random = generateRandom(1, totalSeats);
			randomNumberDice.textContent = random;
			timeElapsed += 50;
		}, 50);
	});
}

async function rollUp(seatNumber){
	const firstRollEl = document.querySelector('.casino-number-roll:first-child');
	const secondRollEl = document.querySelector('.casino-number-roll:last-child');

	const stringNumber = seatNumber.toString().padStart(2, '0');
	const firstNumber = Number(stringNumber[0]);
	const secondNumber = Number(stringNumber[1]);

	let totalFirstRotation = generateRandom(3, 8) * 360;
	let totalSecondRotation = generateRandom(3, 8) * 360;
	
	const additionalFirstRotation = firstNumber * (360 / 10);
	const additionalSecondRotation = secondNumber * (360 / 10);
	
	totalFirstRotation += additionalFirstRotation;
	totalSecondRotation += additionalSecondRotation;

	const firstTime = generateRandom(3000, 5000);
	const secondTime = firstTime + generateRandom(500, 1500);

	const firstAnimation = firstRollEl.animate(
		[
			{ transform: 'rotateX(0deg)' },
			{ transform: `rotateX(${-totalFirstRotation}deg)` }
		],
		{
			easing: 'cubic-bezier(0.1, 0.7, 0.1, 1)',
			duration: firstTime,
			fill: 'forwards'
		}
	);

	const secondAnimation = secondRollEl.animate(
		[
			{ transform: 'rotateX(0deg)' },
			{ transform: `rotateX(${-totalSecondRotation}deg)` }
		],
		{
			easing: 'cubic-bezier(0.1, 0.7, 0.1, 1)',
			duration: secondTime,
			fill: 'forwards'
		}
	);

	await Promise.all([firstAnimation.finished, secondAnimation.finished]);
} 

function occupySeat(number) {
	const seat = document.querySelector(`.seat[data-number='${number}']`);
	seat.classList.add("seat-occupied");
	const seatName = seat.querySelector(".name");
	seatName.textContent = userNameEl.value;
	removeNumberFromArray(number);
	addBall();	
	updateRemainingSeats();
}

function removeNumberFromArray(number) {
	numbers = numbers.filter((e) => e != number);
}

function checkFull() {
	const data = JSON.parse(
		localStorage.getItem(`${keyPrefix}_RANDOMIZED`) ?? "{}"
	);
	return Object.keys(data).length == totalSeats;
}

// initialization
let numbers = createSequenceOfNumbers(1, totalSeats);
let randoming = 0;
initializeSeats();
randomizeBtns.forEach(randomizeBtn => randomizeBtn.addEventListener("click", async function () {
	if (randoming == 1) return;
	if (userNameEl.value == null || userNameEl.value == "") {
		return alert("Please enter your name!!");
	}

	if(randomizeBtn.classList.contains("random-number-casino-pull-btn")){
		randomNumberCasino.classList.add("lottering");
	}

	if (checkFull()) {
		alert("Full Seats!! Please Reset!!");
		return;
	}

	randoming = 1;
	let randomNumber;
	do {
		randomNumber = generateRandomFromArray(numbers);
	} while (checkForExistence(randomNumber));

	if(config['seat-randomer'] == 'dice'){
		await shuffle();
		randomNumberDice.textContent = randomNumber;
	}else if(config['seat-randomer'] == 'casino'){
		await rollUp(randomNumber);
	}
	
	occupySeat(randomNumber);
	setSeatToLocalStorage(randomNumber);
	userNameEl.value = null;
	randoming = 0;
	if(randomizeBtn.classList.contains("random-number-casino-pull-btn")){
		randomNumberCasino.classList.remove("lottering");
	}
}));

refreshSeatsEl.addEventListener("click", function () {
	localStorage.removeItem(`${keyPrefix}_RANDOMIZED`);
	document.querySelectorAll(".seat").forEach((el) => {
		el.classList.remove("seat-occupied");
		const nameEL = el.querySelector(".name");
		nameEL.innerHTML = "<p class='red'>NONE</p>";
	});
	updateRemainingSeats();
	balls = []; // in canvas.js
	numbers = createSequenceOfNumbers(1, totalSeats);

	// start - for carantine purpose
	highlightOccupiedSeats();
	// end
});



// sidebar controls and configuration types
const sidebarToggler = document.querySelector("#sidebar-controls .sidebar-controls-toggler");
const sidebarControls = document.querySelector("#sidebar-controls");
const seatTypeSelect = document.querySelector("#seat-type");
const seatRandomerSelect = document.querySelector("#seat-randomer");
const validSeatType = ['square', 'circle', 'polygon'];
const validRandomerType = ['dice', 'casino', 'roulette'];

function switchRandomizeBtn(){
	// randomize button
	if(config['seat-randomer'] == 'casino'){
		document.querySelector(".universal-randomize-btn").style.display = 'none';
	}else {	
		document.querySelector(".universal-randomize-btn").style.display = 'block';
	}
}

function initializeConfig(){
	const data = JSON.parse(
		localStorage.getItem(`${keyPrefix}_CONFIG`) ?? "{}"
	);
	
	// seat type
	validSeatType.forEach(c => document.body.classList.remove(c));
	document.body.classList.add(`seat-type-${data["seat-type"] ?? 'square'}`);
	document.querySelector(`option[value="${data["seat-type"] ?? 'square'}"]`).selected = true;

	// randomer
	validRandomerType.forEach(c => document.querySelector(`#random-number-${c}`).style.display = 'none');
	document.querySelector(`#random-number-${data["seat-randomer"] ?? 'dice'}`).style.display = 'flex';
	document.querySelector(`option[value="${data["seat-randomer"] ?? 'dice'}"]`).selected = true;

	config = data;
	switchRandomizeBtn();
}

function setConfigToLocalStorage(){
	localStorage.setItem(`${keyPrefix}_CONFIG`, JSON.stringify(config));
}

initializeConfig();

sidebarToggler.addEventListener('click', function(){
	sidebarControls.classList.toggle("open");
});

window.addEventListener('click', function(e){
	const parent = e.target.closest('#sidebar-controls');
	if(!parent) sidebarControls.classList.remove('open');
});

seatTypeSelect.addEventListener('change', function(){
	validSeatType.forEach(c => document.body.classList.remove(`seat-type-${c}`));
	document.body.classList.add(`seat-type-${seatTypeSelect.value}`);
	config['seat-type'] = seatTypeSelect.value;
	setConfigToLocalStorage();
});

seatRandomerSelect.addEventListener('change', function(){
	validRandomerType.forEach(c => document.querySelector(`#random-number-${c}`).style.display = 'none');

	document.querySelector(`#random-number-${seatRandomerSelect.value}`).style.display = 'flex';
	config['seat-randomer'] = seatRandomerSelect.value;
	setConfigToLocalStorage();
	switchRandomizeBtn();
});

const bgImage = [
	"background/1.JPG",
	"background/2.JPG",
	"background/3.JPG",
	"background/4.JPG",
	"background/5.JPG",
	"background/6.JPG",
	"background/7.JPG",
	"background/8.JPG",
	"background/9.JPG"
]

document.addEventListener("DOMContentLoaded", () => {
	const bgContainer = document.querySelector(".main-bg img");
	let currIdx = 0;

	setInterval(() => {
		bgContainer.style.filter = "blur(0.3125rem)";
		bgContainer.style.opacity = 0.025;
		
		let nowIdx = Math.floor(Math.random() * bgImage.length);
		if (nowIdx == currIdx){
			nowIdx++;
			
			if(nowIdx > bgImage.length-1){
				nowIdx %= bgImage.length;
			}
		}
		
		const newImage = document.createElement("img");
		newImage.src = bgImage[nowIdx];
		
		newImage.onload = () => {
			setTimeout(() => {
				bgContainer.src = newImage.src;
				bgContainer.style.opacity = 0.2;
				bgContainer.style.filter = "blur(0)";
			}, 1500);
		};

		currIdx = nowIdx;
	}, 7000);
});