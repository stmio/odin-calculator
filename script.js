let displayValue = "";
let operator = null;
let firstOperand = null;
let secondOperand = null;
let result = 0;

function operate(operator, a, b) {
  if (operator === "add") return a + b;
  if (operator === "subtract") return a - b;
  if (operator === "multiply") return a * b;
  if (operator === "divide") {
    if (b === 0) return "ERROR";
    return a / b;
  }
}

function buttonPressed(button) {
  if (button.classList.contains("operand")) {
    if (typeof displayValue !== "string" || displayValue === "ERROR") {
      displayValue = "";
    }
    if (button.id === "decimal" && displayValue.includes(".")) return;
    displayValue = displayValue.concat(button.textContent);
  } else if (button.classList.contains("operator")) {
    storeOperand(displayValue);
    inputOperator(button.id);
  } else if (button.id === "equals") {
    if (!firstOperand) storeOperand(result);
    if (!secondOperand) storeOperand(displayValue);
    result = operate(operator, firstOperand, secondOperand);
    displayValue = result;
    firstOperand = null;
    secondOperand = null;
    operator = null;
  } else if (button.id === "delete") {
    displayValue = displayValue.slice(0, -1);
  } else if (button.id === "clear") {
    window.location.reload();
  }
  updateDisplay();
}

function inputOperator(op) {
  if (!operator) {
    operator = op;
    displayValue = "";
  } else {
    if (!secondOperand) storeOperand(displayValue);
    result = operate(operator, firstOperand, secondOperand);
    operator = op;
    displayValue = result;
    firstOperand = result;
    secondOperand = null;
  }
}

function storeOperand(operand) {
  if (!firstOperand) firstOperand = Number(operand);
  else secondOperand = Number(operand);
}

function updateDisplay() {
  const screen = document.querySelector("#screen");
  screen.textContent = displayValue;
}

const keypadButtons = document.querySelectorAll("button");
keypadButtons.forEach((button) =>
  button.addEventListener("click", () => buttonPressed(button))
);
