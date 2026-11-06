
const result = document.getElementById("result");
const previous = document.getElementById("previous");
const buttons = document.querySelector(".buttons");
const themeBtn = document.getElementById("themeBtn");

let currentNumber = "0";
let firstNumber = null;
let selectedOperator = null;
let resetScreen = false;

function updateScreen() {
    result.value = currentNumber;
}

function addNumber(number) {
    if (resetScreen) {
        currentNumber = number === "." ? "0." : number;
        resetScreen = false;
    } else if (number === ".") {
        if (!currentNumber.includes(".")) {
            currentNumber += ".";
        }
    } else {
        currentNumber = currentNumber === "0"
            ? number
            : currentNumber + number;
    }

    updateScreen();
}

function chooseOperator(operator) {
    if (selectedOperator && !resetScreen) {
        calculate();
    }

    firstNumber = Number(currentNumber);
    selectedOperator = operator;
    previous.textContent = currentNumber + " " + operator;
    resetScreen = true;
}

function calculate() {
    if (selectedOperator === null || firstNumber === null) return;

    const secondNumber = Number(currentNumber);
    let answer;

    switch (selectedOperator) {
        case "+":
            answer = firstNumber + secondNumber;
            break;

        case "-":
            answer = firstNumber - secondNumber;
            break;

        case "*":
            answer = firstNumber * secondNumber;
            break;

        case "/":
            if (secondNumber === 0) {
                currentNumber = "Cannot divide by zero";
                selectedOperator = null;
                firstNumber = null;
                previous.textContent = "";
                updateScreen();
                resetScreen = true;
                return;
            }
            answer = firstNumber / secondNumber;
            break;
    }

    previous.textContent =
        firstNumber + " " + selectedOperator + " " + secondNumber + " =";

    currentNumber = String(Number(answer.toPrecision(10)));
    selectedOperator = null;
    firstNumber = null;
    resetScreen = true;

    updateScreen();
}

function clearCalculator() {
    currentNumber = "0";
    firstNumber = null;
    selectedOperator = null;
    resetScreen = false;
    previous.textContent = "";
    updateScreen();
}

function deleteNumber() {
    if (resetScreen) {
        currentNumber = "0";
        resetScreen = false;
    } else {
        currentNumber = currentNumber.slice(0, -1);

        if (currentNumber === "" || currentNumber === "-") {
            currentNumber = "0";
        }
    }

    updateScreen();
}

function percentage() {
    currentNumber = String(Number(currentNumber) / 100);
    updateScreen();
}

buttons.addEventListener("click", function(event) {
    const button = event.target.closest("button");

    if (!button) return;

    const action = button.dataset.action;
    const value = button.dataset.value;

    if (value !== undefined) {
        if ("0123456789.".includes(value)) {
            addNumber(value);
        } else {
            chooseOperator(value);
        }
    }

    if (action === "clear") clearCalculator();
    if (action === "delete") deleteNumber();
    if (action === "percent") percentage();
    if (action === "equals") calculate();
});

themeBtn.addEventListener("click", function() {
    document.body.classList.toggle("light");

    themeBtn.textContent =
        document.body.classList.contains("light") ? "☾" : "☀";
});

document.addEventListener("keydown", function(event) {
    const key = event.key;

    if ("0123456789.".includes(key) && key.length === 1) {
        addNumber(key);
    } else if (["+", "-", "*", "/"].includes(key)) {
        chooseOperator(key);
    } else if (key === "Enter" || key === "=") {
        calculate();
    } else if (key === "Backspace") {
        deleteNumber();
    } else if (key === "Escape") {
        clearCalculator();
    } else if (key === "%") {
        percentage();
    }
});
