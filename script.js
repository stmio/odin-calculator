let displayValue = "";
let firstOperator = null;
let secondOperator = null;
let firstOperand = null;
let secondOperand = null;
let result = null;

function operate(operator, a, b) {
  if (operator === "add") return a + b;
  if (operator === "subtract") return a - b;
  if (operator === "multiply") return a * b;
  if (operator === "divide") return a / b;
}

function buttonPressed(button) {
  if (button.classList.contains("operand")) {
    if (typeof displayValue !== "string") displayValue = "";
    displayValue = displayValue.concat(button.id);
  } else if (button.classList.contains("operator")) {
    firstOperand = Number(displayValue);
    displayValue = "";
    firstOperator = button.id;
  } else if (button.id === "equals") {
    secondOperand = Number(displayValue);
    result = operate(firstOperator, firstOperand, secondOperand);
    displayValue = result;
  }
  updateDisplay();
}

function updateDisplay() {
  const screen = document.querySelector("#screen");
  screen.textContent = displayValue;
}

const keypadButtons = document.querySelectorAll("button");
keypadButtons.forEach((button) =>
  button.addEventListener("click", () => buttonPressed(button))
);
