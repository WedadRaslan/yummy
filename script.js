// https://www.themealdb.com/api/json/v1/1/search.php?s=Arrabiata
const menubars = document.getElementById("menubars");
const navContainer = document.querySelector(".nav-container");
const navContent = document.querySelector(".nav-content-container");
const navItems = document.querySelectorAll(".nav-items ul li");
const contentContainer = document.querySelector(".content-container");
const nameSearch = document.getElementById("name_search");

const inputs_wrapper = document.getElementById("inputs_wrapper");
const letterSearch = document.getElementById("letter_search");
const cardsWrapper = document.querySelector(
  ".content-container .cards-wrapper"
);
const spinner_container = document.querySelector(".spinner_container");

// form inputs
let name_input,
  email_input,
  phone_input,
  age_input,
  password_input,
  confirm_pass_input,
  submit_button;

let data;

const fetching_data = async (url) => {
  try {
    const response = await fetch(url);
    data = await response.json();
    console.log(data);
  } catch (error) {
    console.log(error);
  }
};

const handleMenubar = () => {
  // menubars.classList.remove("fa-bars")
  menubars.classList.toggle("fa-xmark");
  navContainer.classList.toggle("translate_x");
  navItems.forEach((item, index) => {
    item.classList.toggle(`list_${index + 1}`);
  });
};

const get_measures_ingredients = (meal) => {
  let recipesCode = "";
  let ingredientArray = [];
  let measureArray = [];
  for (let index = 1; index <= 20; index++) {
    ingredientArray.push(`strIngredient${index}`);
    measureArray.push(`strMeasure${index}`);
  }
  for (let index = 0; index < ingredientArray.length; index++) {
    if (meal[measureArray[index]] == " " || meal[measureArray[index]] == "") {
      continue;
    } else {
      let recipe = `<div class="recipe">${meal[measureArray[index]]} ${
        meal[ingredientArray[index]]
      }</div>`;
      recipesCode += recipe;
    }
  }
  return recipesCode;
};

const get_tags = (meal) => {
  let tagsArray;
  if (meal.strTags == null) {
    tagsArray = [];
  } else {
    tagsArray = meal.strTags.split(",");
  }
  let tagsCode = "";
  for (let index = 0; index < tagsArray.length; index++) {
    let tag = `<div class="tag">${tagsArray[index]}</div>`;
    tagsCode += tag;
  }
  return tagsCode;
};

const go_to_meal_details = async (mealId) => {
  spinner_container.style.display = "flex";
  let url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`;
  await fetching_data(url);

  cardsWrapper.innerHTML = " ";
  data.meals?.forEach((meal) => {
    const htmlCode =
      '<div class="meal_details">' +
      '<div class="meal_details_image">' +
      `<img src="${meal.strMealThumb}" alt="">` +
      `<h2>${meal.strMeal}</h2>` +
      "</div>" +
      "<div class='meal_details_content'>" +
      `<h3>Instructions</h3>` +
      `<p class='instructions'>${meal.strInstructions}</p>` +
      `<div class="area">` +
      "<span>Area :</span>" +
      `${meal.strArea}` +
      `</div>` +
      `<div class="category">` +
      "<span>Category :</span>" +
      `${meal.strCategory}` +
      `</div>` +
      `<span >Recipes : </span>` +
      "<div class='recipes_wrapper'>" +
      get_measures_ingredients(meal) +
      "</div>" +
      `<div>` +
      "<span>Tags :</span>" +
      `<div class='tags_wrapper'>` +
      get_tags(meal) +
      `</div>` +
      `</div>` +
      "<div class='links'>" +
      `<a href="${meal.strSource}" target="_blank">Source</a>` +
      `<a href="${meal.strYoutube}" target="_blank">youtube</a>` +
      "</div>" +
      "</div>" +
      "</div>";

    cardsWrapper.innerHTML += htmlCode;
  });
  spinner_container.style.display = "none";
};

//======================== fetch food data from api to put it in the home page ===================
const home_page = async () => {
  spinner_container.style.display = "flex";

  const url = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
  await fetching_data(url);

  cardsWrapper.innerHTML = " ";
  data.meals.forEach((meal) => {
    const htmlCode =
      `<div class="card" onclick="go_to_meal_details(${meal.idMeal})">` +
      `<img src=${meal.strMealThumb} alt="" />` +
      `<div class="overlay">` +
      `<h2>${meal.strMeal}</h2>` +
      "</div>" +
      "</div>";

    cardsWrapper.innerHTML += htmlCode;
  });
  spinner_container.style.display = "none";
};

home_page();

// ============================== Search ===============================

let searchQuery = "";
const handleChange = async (event) => {
  spinner_container.style.display = "flex";
  searchQuery = event.target.value;
  let url;
  console.log(event.target.id);
  if (event.target.id == "name_search") {
    url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchQuery}`;
  } else {
    url = `https://www.themealdb.com/api/json/v1/1/search.php?f=${searchQuery}`;
  }
  await fetching_data(url);

  cardsWrapper.innerHTML = " ";
  data.meals?.forEach((meal) => {
    const htmlCode =
      `<div class="card" onclick="go_to_meal_details(${meal.idMeal})">` +
      `<img src=${meal.strMealThumb} alt="" />` +
      `<div class="overlay">` +
      `<h2>${meal.strMeal}</h2>` +
      "</div>" +
      "</div>";

    cardsWrapper.innerHTML += htmlCode;
  });
  spinner_container.style.display = "none";
};

const go_to_search = async () => {
  spinner_container.style.display = "flex";
  inputs_wrapper.style.display = "flex";
  cardsWrapper.innerHTML = " ";
  handleMenubar();
  spinner_container.style.display = "none";
};

// ============================= categories ============================
const go_to_categories = async () => {
  spinner_container.style.display = "flex";
  inputs_wrapper.style.display = "none";
  handleMenubar();

  let url = "https://www.themealdb.com/api/json/v1/1/categories.php";
  await fetching_data(url);

  cardsWrapper.innerHTML = " ";
  data.categories.forEach((category) => {
    const htmlCode =
      `<div class="card" onclick="filter_by_category('${category.strCategory}')">` +
      `<img src=${category.strCategoryThumb} alt="" />` +
      `<div class="overlay">` +
      `<h2>${category.strCategory}</h2>` +
      `<p>${category.strCategoryDescription.slice(0, 100)}</div>` +
      "</div>" +
      "</div>";
    cardsWrapper.innerHTML += htmlCode;
  });
  spinner_container.style.display = "none";
};

// =========== filter by category ============

const filter_by_category = async (category) => {
  spinner_container.style.display = "flex";
  inputs_wrapper.style.display = "none";
  let url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;
  await fetching_data(url);

  cardsWrapper.innerHTML = " ";
  data.meals.forEach((meal) => {
    const htmlCode =
      `<div class="card" onclick="go_to_meal_details(${meal.idMeal})">` +
      `<img src=${meal.strMealThumb} alt="" />` +
      '<div class="overlay">' +
      `<h2>${meal.strMeal}</h2>` +
      "</div>" +
      "</div>";

    cardsWrapper.innerHTML += htmlCode;
  });
  spinner_container.style.display = "none";
};

// ============================= Areas ============================

const go_to_areas = async () => {
  spinner_container.style.display = "flex";
  inputs_wrapper.style.display = "none";
  handleMenubar();

  let url = "https://www.themealdb.com/api/json/v1/1/list.php?a=list";
  await fetching_data(url);

  cardsWrapper.innerHTML = " ";
  data.meals.forEach((meal) => {
    const htmlCode =
      `<div class="card" onclick="filter_by_area('${meal.strArea}')">` +
      `<i class="fa-solid fa-house"></i>` +
      `<h2>${meal.strArea}</h2>` +
      "</div>";
    cardsWrapper.innerHTML += htmlCode;
  });
  spinner_container.style.display = "none";
};
// =========== filter by area ============
const filter_by_area = async (area) => {
  spinner_container.style.display = "flex";
  inputs_wrapper.style.display = "none";
  let url = `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`;
  await fetching_data(url);

  cardsWrapper.innerHTML = " ";
  data.meals.forEach((meal) => {
    const htmlCode =
      `<div class="card" onclick="go_to_meal_details(${meal.idMeal})">` +
      `<img src=${meal.strMealThumb} alt="" />` +
      '<div class="overlay">' +
      `<h2>${meal.strMeal}</h2>` +
      "</div>" +
      "</div>";

    cardsWrapper.innerHTML += htmlCode;
  });
  spinner_container.style.display = "none";
};

// ============================= Ingredients ============================

const go_to_ingredients = async () => {
  spinner_container.style.display = "flex";

  inputs_wrapper.style.display = "none";
  handleMenubar();

  let url = "https://www.themealdb.com/api/json/v1/1/list.php?i=list";
  await fetching_data(url);

  cardsWrapper.innerHTML = " ";
  data.meals.slice(0, 20).forEach((meal) => {
    const htmlCode =
      `<div class="card" onclick="filter_by_ingredient('${meal.strIngredient}')">` +
      `<i class="fa-solid fa-utensils"></i>` +
      `<h2>${meal.strIngredient}</h2>` +
      `<p class="ingredient_p">${meal.strDescription.slice(0, 100)}</p>` +
      "</div>";

    cardsWrapper.innerHTML += htmlCode;
  });
  spinner_container.style.display = "none";
};

// =========== filter by ingredient ============

const filter_by_ingredient = async (ingredient) => {
  spinner_container.style.display = "flex";
  inputs_wrapper.style.display = "none";
  let url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`;
  await fetching_data(url);

  cardsWrapper.innerHTML = " ";
  data.meals.forEach((meal) => {
    const htmlCode =
      `<div class="card" onclick="go_to_meal_details(${meal.idMeal})">` +
      `<img src=${meal.strMealThumb} alt="" />` +
      '<div class="overlay">' +
      `<h2>${meal.strMeal}</h2>` +
      "</div>" +
      "</div>";

    cardsWrapper.innerHTML += htmlCode;
  });
  spinner_container.style.display = "none";
};

// ============================= Ingredients ============================
const go_to_contact = () => {
  inputs_wrapper.style.display = "none";
  handleMenubar();

  const htmlCode =
    "<form>" +
    '<div class="inputs_row">' +
    '<div>'+
    '<input id="name_input" type="text" placeholder="Enter Your Name" oninput="handle_form_inputs(event)" onchange="handle_form_inputs(event)">' +
    '<div class="error_message">Name Not Valide</div>' +
    '</div>'+
    '<div>'+
    '<input id="email_input" type="email" placeholder="Enter Your Email" oninput="handle_form_inputs(event)" onchange="handle_form_inputs(event)">' +
    '<div class="error_message">Email Not Valide</div>' +
    '</div>'+
    "</div>" +
    '<div class="inputs_row">' +
    '<div>'+
    '<input id="phone_input" type="tel"  placeholder="Enter Your Phone" oninput="handle_form_inputs(event)" onchange="handle_form_inputs(event)">' +
    '<div class="error_message">Phone Not Valide</div>' +
    '</div>'+
    '<div>'+
    '<input id="age_input" type="number" placeholder="Enter Your Age" oninput="handle_form_inputs(event)" onchange="handle_form_inputs(event)">' +
    '<div class="error_message">Must be greater than 11</div>' +
    '</div>'+
    "</div>" +
    '<div class="inputs_row">' +
    '<div>'+
    '<input id="password_input" type="password"  placeholder="Enter Your password" oninput="handle_form_inputs(event)" onchange="handle_form_inputs(event)">' +
    '<div class="error_message">(at least 8 characters, containing at least one uppercase letter, one lowercase letter, one digit, and one special character</div>' +
    '</div>'+
    '<div>'+
    '<input id="confirm_pass_input" type="password" placeholder="Repassword" oninput="handle_form_inputs(event)" onchange="handle_form_inputs(event)">' +
    '<div class="error_message">Not Correct</div>' +
    '</div>'+
    "</div>" +
    '<button id="submit" type="submit" disabled>Submit</button>' +
    "</from>";

  cardsWrapper.innerHTML = htmlCode;

  // form inputs
  name_input = document.getElementById("name_input");
  email_input = document.getElementById("email_input");
  phone_input = document.getElementById("phone_input");
  age_input = document.getElementById("age_input");
  password_input = document.getElementById("password_input");
  confirm_pass_input = document.getElementById("confirm_pass_input");
  submit_button = document.getElementById("submit");
  error_messages = document.querySelectorAll('.error_message')
};

const validateForm = () => {
  const password_regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/ ;
  const gmail_regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ ;

  if(name_input.value.trim() != ""){
    error_messages[0].style.display = 'none'
  }else{
    error_messages[0].style.display = 'block'
  }

  if(gmail_regex.test(email_input.value.trim())){
    error_messages[1].style.display = 'none'
  }else{
    error_messages[1].style.display = 'block'
  }

  if(phone_input.value.trim().length == 11){
    error_messages[2].style.display = 'none'
  }else{
    error_messages[2].style.display = 'block'
  }

  if(age_input.value.trim() > 11){
    error_messages[3].style.display = 'none'
  }else{
    error_messages[3].style.display = 'block'
  }

  if(password_regex.test(password_input.value.trim())){
    error_messages[4].style.display = 'none'
  }else{
    error_messages[4].style.display = 'block'
  }

  if(confirm_pass_input.value.trim() == password_input.value.trim()){
    error_messages[5].style.display = 'none'
  }else{
    error_messages[5].style.display = 'block'
  }

  if (
    name_input.value.trim() != "" &&
    email_input.value.trim() != "" &&
    phone_input.value.trim() != "" &&
    age_input.value.trim() > 0 &&
    password_regex.test(password_input.value.trim()) &&
    confirm_pass_input.value.trim() == password_input.value.trim()
  ) {
    submit_button.disabled = false;
  }else{
    submit_button.disabled = true;
  }
};

const handle_form_inputs = (event) => {
  validateForm();
};
