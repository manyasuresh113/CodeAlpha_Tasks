// ===============================
// ELEMENTS
// ===============================

const display = document.getElementById("display");
const expressionDisplay = document.getElementById("expression");

const buttons = document.querySelectorAll(".buttons button");

// ===============================
// VARIABLES
// ===============================

let expression = "";

// ===============================
// HISTORY
// ===============================

const historyList = document.getElementById("history-list");
const clearHistoryBtn = document.getElementById("clear-history");

let history = JSON.parse(localStorage.getItem("history")) || [];

// ===============================
// UPDATE DISPLAY
// ===============================

function updateDisplay() {

    if (expression === "") {
        display.value = "0";
        expressionDisplay.textContent = "";
        return;
    }

    display.value = expression;
    expressionDisplay.textContent = expression;

}

// ===============================
// CLEAR
// ===============================

function clearDisplay() {

    expression = "";

    updateDisplay();

}

// ===============================
// DELETE LAST CHARACTER
// ===============================

function deleteLast() {

    expression = expression.slice(0, -1);

    updateDisplay();

}

// ===============================
// APPEND VALUE
// ===============================

function appendValue(value){

    if(
        display.value === "Invalid Expression" ||
        display.value === "Cannot divide by 0"
    ){

        expression = "";

    }

    expression += value;

    updateDisplay();

}

// ===============================
// CALCULATE
// ===============================

function calculate() {

    if (expression === "") return;

    try {

        let exp = expression
            .replace(/×/g, "*")
            .replace(/÷/g, "/")
            .replace(/−/g, "-")
            .replace(/%/g, "/100");

        let result = eval(exp);

        if (!isFinite(result)) {

            display.value = "Cannot divide by 0";

            expression = "";

            expressionDisplay.textContent = "";

            return;

        }

        const previousExpression = expression;

        expression = result.toString();

        expressionDisplay.textContent = previousExpression + " =";

        display.value = expression;

        addHistory(previousExpression, expression);

    }

    catch {

        display.value = "Invalid Expression";

        expressionDisplay.textContent = "";

        expression = "";

    }

}


// ===============================
// HISTORY FUNCTIONS
// ===============================

function renderHistory(){

    historyList.innerHTML = "";

    if(history.length === 0){

        historyList.innerHTML = "<li>No calculations yet.</li>";

        return;

    }

    history.slice().reverse().forEach(item=>{

        const li = document.createElement("li");

        li.textContent = item;

        // Click to reuse result
        li.addEventListener("click",()=>{

            const result = item.split("=")[1].trim();

            expression = result;

            updateDisplay();

        });

        historyList.appendChild(li);

    });

}

function saveHistory(){

    localStorage.setItem(

        "history",

        JSON.stringify(history)

    );

}

function addHistory(calculation,result){

    history.push(`${calculation} = ${result}`);

    if(history.length > 20){

        history.shift();

    }

    saveHistory();

    renderHistory();

}

// ===============================
// CLEAR HISTORY
// ===============================

clearHistoryBtn.addEventListener("click",()=>{

    history=[];

    saveHistory();

    renderHistory();

});

// ===============================
// BUTTON EVENTS
// ===============================

buttons.forEach(button => {

    button.addEventListener("click", () => {

        const value = button.innerText;

        switch (value) {

            case "AC":
                clearDisplay();
                break;

            case "⌫":
                deleteLast();
                break;

            case "=":
                calculate();
                break;

            default:
                appendValue(value);

        }

    });

});

// ===============================
// INITIAL DISPLAY
// ===============================

updateDisplay();

renderHistory();

// ===============================
// THEME TOGGLE
// ===============================

const themeToggle = document.getElementById("theme-toggle");
const themeIcon = themeToggle.querySelector("i");

// Load saved theme
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "light") {
    document.body.classList.add("light");
    themeIcon.className = "fa-solid fa-sun";
} else {
    document.body.classList.remove("light");
    themeIcon.className = "fa-solid fa-moon";
}

// Toggle Theme
themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("light");

    if (document.body.classList.contains("light")) {

        localStorage.setItem("theme", "light");

        themeIcon.className = "fa-solid fa-sun";

    } else {

        localStorage.setItem("theme", "dark");

        themeIcon.className = "fa-solid fa-moon";

    }

});

// ===============================
// COLOR THEMES
// ===============================

const themeSelect = document.getElementById("theme-select");

const savedColor = localStorage.getItem("colorTheme");

if(savedColor){

    document.body.classList.add(savedColor);

    themeSelect.value = savedColor.replace("theme-","");

}

themeSelect.addEventListener("change",()=>{

    document.body.classList.remove(
        "theme-purple",
        "theme-green",
        "theme-orange"
    );

    if(themeSelect.value !== "default"){

        document.body.classList.add(
            "theme-"+themeSelect.value
        );

        localStorage.setItem(
            "colorTheme",
            "theme-"+themeSelect.value
        );

    }

    else{

        localStorage.removeItem("colorTheme");

    }

});