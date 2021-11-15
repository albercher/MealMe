const formSearch = document.querySelector("#search-form");
const randomSearch = document.querySelector("#random-button");
const star1 = document.querySelector("#star-1");
const alertMsg = document.getElementById("alert");

const baseurl = "https://www.themealdb.com/api/json/v1/1/"

/* FUNCTIONS */
// get a random number with the max being length of array
function randomNumber(max) {
    return Math.floor(Math.random() * max)
}

// default state for star
activate();

// function to toggle star fill and color
function starToggle(){
    this.classList.toggle("bi-star");
    this.classList.toggle("bi-star-fill");
    this.classList.toggle("text-warning");
}

function activate(){
    // add and remove class when hover over star to fill yellow
    star1.addEventListener("mouseover", starToggle);

    // add and remove class when leaving star to return to original state
    star1.addEventListener("mouseout", starToggle);

    // remove event listener that makes it blink
    star1.removeEventListener("click", activate);

    // if clicked, it will no longer blink
    star1.addEventListener("click", deactivate);

    // console.log("star should blink, resting state empty")
}

function deactivate(){
    // add and remove class when hover over star to fill yellow
    star1.removeEventListener("mouseover", starToggle);

    // add and remove class when leaving star to return to original state
    star1.removeEventListener("mouseout", starToggle);

    // remove event listener that makes it not blink
    star1.removeEventListener("click", deactivate);

    // if clicked, it will blink
    star1.addEventListener("click", activate);
    

    // console.log("star should be full, no movement on hover")
}

// function to toggle alert visibility, and changes html for search query
function toggleAlert(newText){
    alertMsg.classList.toggle("invisible");
    alertMsg.innerHTML = `Your search - <b>${newText}</b> - did not match any recipes.`
}
// function to display recipe
function recipeDisplay(info) {
    let mealName = document.querySelector("#meal-name");
    let mealImg = document.querySelector("#meal-image");
    let instruct = document.querySelector("#instructions");

    mealName.innerHTML = info.strMeal;
    mealImg.src = info.strMealThumb;
    mealImg.alt = `${info.strMeal} image`;
    instruct.textContent = info.strInstructions;
    for (let i = 1; i < 21; i++){ // ingredients each assigned to a new li
        if (info[`strIngredient${i}`] === ""){
            break;
        } else {
            let ingred = document.querySelector("#ingredients");
            let newLi = document.createElement("li");
            newLi.innerHTML = info[`strMeasure${i}`] + " " + info[`strIngredient${i}`];
            //             newLi.innerHTML = info[`strIngredient${i}`] + "-" + info[`strMeasure${i}`];
            // i want to switch so there is a - between. doesnt make sense sometimes at current state
            
            ingred.append(newLi);
        }
    }


}

/* EVENT LISTENERS */
formSearch.addEventListener("submit", (e) => {
    e.preventDefault();
    let formValue = document.querySelector("#search-text").value;
    fetch(`${baseurl}search.php?s=${formValue}`)
    .then(response => response.json())
    .then(data => {
        let arr = data.meals;
        if (arr == null) {             // error message
            toggleAlert(formValue);
            setTimeout(function(){
                toggleAlert()
            }, 8000) // error message leaves after 8 seconds
        } else {
            let max = arr.length;
            let rand = randomNumber(max);
            recipeDisplay(arr[rand]);
            document.querySelector("#results").classList.remove("invisible");
        }
    });

    // if star for previous recipe is full, we set it to empty and activate it.
    star1.classList.remove("bi-star-fill", "text-warning");
    star1.classList.add("bi-star");
    activate();
    formSearch.reset();
})


