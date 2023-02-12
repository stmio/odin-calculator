let displayValue = "";
let operator = null;
let firstOperand = null;
let secondOperand = null;
let result = 0;

function operate(operator, a, b) {
  let n;
  if (!operator) return;

  if (operator === "add") n = a + b;
  if (operator === "subtract") n = a - b;
  if (operator === "multiply") n = a * b;
  if (operator === "divide") {
    if (b === 0) return "ERROR";
    n = a / b;
  }

  return round(n, 15);
}

function round(num, decimals) {
  return Number(Math.round(num + "e" + decimals) + "e-" + decimals);
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
  } else if (button.id === "delete" && typeof displayValue === "string") {
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

function handleKeyboardInput(event) {
  // Numerical key presses (0-9)
  if (event.key >= 0 && event.key <= 9) {
    const keypadButton = document.getElementById(event.key);
    if (keypadButton) buttonPressed(keypadButton);
  }

  // Decimal point key presses (.)
  if (event.key === ".") {
    buttonPressed(document.getElementById("decimal"));
  }

  // Operator key presses (+ - * /)
  if (["+", "-", "*", "/"].includes(event.key)) {
    event.preventDefault();
    let operation;
    if (event.key === "+") operation = "add";
    if (event.key === "-") operation = "subtract";
    if (event.key === "*") operation = "multiply";
    if (event.key === "/") operation = "divide";

    buttonPressed(document.getElementById(operation));
  }

  // Equals key presses (ENTER =)
  if (event.key === "Enter" || event.key === "=") {
    buttonPressed(document.getElementById("equals"));
  }

  // Delete key presses (DELETE BACKSPACE)
  if (event.key === "Delete" || event.key === "Backspace") {
    buttonPressed(document.getElementById("delete"));
  }

  // Clear key presses (ESCAPE c)
  if (event.key === "Escape" || event.key === "c") {
    event.preventDefault();
    buttonPressed(document.getElementById("clear"));
  }
}

// Listen for calculator keypad button presses
const keypadButtons = document.querySelectorAll("button");
keypadButtons.forEach((button) =>
  button.addEventListener("click", () => buttonPressed(button))
);

// Listen for keyboard key presses
window.addEventListener("keydown", handleKeyboardInput);
