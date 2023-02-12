const DEFAULT_DISPLAY_VALUE = 0;
let displayValue = "";

let operator = null;
let firstOperand = null;
let secondOperand = null;

let result = 0;

// Calculate operation and return result
function operate(operator, a, b) {
  let n;
  // Skip if operator is null
  if (!operator) return;

  if (operator === "add") n = a + b;
  if (operator === "subtract") n = a - b;
  if (operator === "multiply") n = a * b;
  if (operator === "divide") {
    // Stop division by zero
    if (b === 0) return "ERROR";
    n = a / b;
  }

  // If result has long decimal, round to max 15 decimal places
  return round(n, 15);
}

// Round number to a specified amount of decimal places
// See https://www.jacklmoore.com/notes/rounding-in-javascript/
function round(num, decimals) {
  return Number(Math.round(num + "e" + decimals) + "e-" + decimals);
}

function handleButtonPress(button) {
  if (button.classList.contains("operand")) {
    // If display contains a previous result or an error,
    // reset display before new number is entered.
    if (typeof displayValue !== "string" || displayValue === "ERROR") {
      displayValue = "";
    }

    // Do not allow more than one decimal point in the display
    if (button.id === "decimal" && displayValue.includes(".")) return;

    // Add inputted digit to end of display
    displayValue = displayValue.concat(button.textContent);
  } else if (button.classList.contains("operator")) {
    // Store value currently on display
    storeOperand(displayValue);

    // Handle operator logic
    inputOperator(button.id);
  } else if (button.id === "equals") {
    // If no operator, skip so display is not cleared
    if (!operator) return;

    // Set second number to the display value
    if (!secondOperand) storeOperand(displayValue);

    // Calculate result
    result = operate(operator, firstOperand, secondOperand);
    displayValue = result;

    // Reset values for next calculation
    clearMemory();
    // Removes active class from operator buttons
    displayCurrentOperator();
  } else if (button.id === "delete" && typeof displayValue === "string") {
    // Delete last digit from display
    displayValue = displayValue.slice(0, -1);
  } else if (button.id === "clear") {
    // Reload the page to reset all variables
    window.location.reload();
  }

  // After calculator logic, update display
  updateDisplay();
}

// Handles operator logic. Allows multiple operators to be chained
function inputOperator(op) {
  // First operator after result
  if (!operator) {
    operator = op;
    displayValue = "";
  } else {
    // For chained operations, calculate the previous result...
    result = operate(operator, firstOperand, secondOperand);

    // ...and set the new values for the next calculation
    operator = op;
    displayValue = result;
    firstOperand = result;
    secondOperand = null;
  }

  // Highlight current operator button
  displayCurrentOperator();
}

// Stores the entered number into the appropriate variable
function storeOperand(operand) {
  if (!firstOperand) firstOperand = Number(operand);
  else secondOperand = Number(operand);
}

function clearMemory() {
  firstOperand = null;
  secondOperand = null;
  operator = null;
}

function updateDisplay() {
  const screen = document.querySelector("#screen");
  screen.textContent = displayValue;
}

// Highlights which calculator operation is active
function displayCurrentOperator() {
  // Remove active class from all operator buttons
  const operatorButtons = document.querySelectorAll(".operator");
  operatorButtons.forEach((button) => button.classList.remove("active"));

  // If no current operator, stop after removing the class from all buttons
  if (!operator) return;

  // Add active class to current operator button
  const currentOperatorButton = document.getElementById(operator);
  currentOperatorButton.classList.add("active");
}

function handleKeyboardInput(event) {
  // Numerical key presses (0-9)
  if (event.key >= 0 && event.key <= 9) {
    const keypadButton = document.getElementById(event.key);
    if (keypadButton) handleButtonPress(keypadButton);
  }

  // Decimal point key presses (.)
  if (event.key === ".") {
    handleButtonPress(document.getElementById("decimal"));
  }

  // Operator key presses (+ - * /)
  if (["+", "-", "*", "/"].includes(event.key)) {
    event.preventDefault();
    let operation;
    if (event.key === "+") operation = "add";
    if (event.key === "-") operation = "subtract";
    if (event.key === "*") operation = "multiply";
    if (event.key === "/") operation = "divide";

    handleButtonPress(document.getElementById(operation));
  }

  // Equals key presses (ENTER =)
  if (event.key === "Enter" || event.key === "=") {
    handleButtonPress(document.getElementById("equals"));
  }

  // Delete key presses (DELETE BACKSPACE)
  if (event.key === "Delete" || event.key === "Backspace") {
    handleButtonPress(document.getElementById("delete"));
  }

  // Clear key presses (ESCAPE c)
  if (event.key === "Escape" || event.key === "c") {
    event.preventDefault();
    handleButtonPress(document.getElementById("clear"));
  }
}

// Listen for calculator keypad button presses
const keypadButtons = document.querySelectorAll("button");
keypadButtons.forEach((button) =>
  button.addEventListener("click", () => handleButtonPress(button))
);

// Listen for keyboard key presses
window.addEventListener("keydown", handleKeyboardInput);

// Set calculator display to default value
displayValue = DEFAULT_DISPLAY_VALUE;
updateDisplay();
