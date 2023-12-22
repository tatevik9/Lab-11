//1- Link to get a random meal
//https://www.themealdb.com/api/json/v1/1/random.php

//2- Link to lookup a specific meal with an id
//https://www.themealdb.com/api/json/v1/1/lookup.php?i=

//3- Link to search for meals using a keyword
//https://www.themealdb.com/api/json/v1/1/search.php?s=

const MealsElement= document.getElementById("meals");
const favoritesElement= document.querySelector('.favorites');
const searchBtn=document.querySelector ('#search');
const searchTerm=document.querySelector('#search-term');

function initMain()
{

  getRandomMeal();
  updateFavoriteMeals();

  searchBtn.addEventListener('click', async ()=>{ 
    const searchWord=searchTerm.value;
    
    const meals= await getmeaalsBysearch(searchWord);

    mealsElement.innerHTML== "";
    if(meals)
    {
      for(let i =0; i<meals.length;i ++)
      {
        addMeal(meals[i]);
      }

    }
  });
}

async function getRandomMeal()
{ 
  const resp= await fetch (`https://www.themealdb.com/api/json/v1/1/random.php`);
  
  const randomData= await resp.json();
  
  const randomMeal= randomData.meals[0];
  console.log(randomMeal);

  MealsElement.innerHTML="";
  addMeal(randomMeal);

}

function addMeal (MealData,random=false)
{
    const meal= document.createElement("div");
    meal.classList.add("meal");
    meal.innerHTML= `<div class="meal-header">
                        ${
                        random?`<span class="random">Meal of the Day</span>`:""
                         }
                        <img src="$CmealData.strMealThumb}" alt= "${mealdata.strMeal}">
                    </div>
                    <div class="meal-body">
                         <h3>${mealdata.strMeal}</h3>
                         <button class="fav-btn">
                            <i class="fas fa-heart"></i>
                         </button>
                    </div>`;
}
    let favoriteButton=meal.querySelector(".fav-btn");
    favoriteButton.addEventListener ("click", ()=>{
      if(favoriteButton.classList.contains('active'))
      {
        //We need to deactivate the button (make the color back to gray)
        favoriteButton.classList.remove('active');
        removeMealFromLocalStorage(mealData.idMeal);
      }
      else
      {
      //We need to activate the button (make the color red)
      favoriteButton.classList.add('active');
      addMealToLocalStorage(mealData.idMeal);
      }

      updatwFavoriteMelas();

 })

    
    mealsElement.appendChild(meal);

    const mealHaeder=meal.querySelector(".meal-header");
    mealHaeder.addEventListener("click",()=>{
      OpenMealDetailsPage (mealData);
  });

function addMealToLocalStorage(mealId)

{
    const mealIds = getMealsFromLocalStorage();
    //console.log(mealIds);
    localStorage.setItem('mealIds',JSON.stringify ([...mealIds,mealId]));

}  
function removeMealFromLocalStorage(mealId)
{
    const mealIds = getMealsFromLocalStorage();
    localStorage.setItem ('mealIds',JSON.stringify(
       mealIds.filter(id=> id!=mealId)
    ));
}


function getMealsFromLocalStorage()
{
    
     const mealIds= JSON.parse(localStorage.getItem('mealids'));
    
     return mealIds=== null? []: mealIds
}

async function updateFavoriteMeals()
{
  favoritesElement.innerHTML="";
  const mealIds=getMealsFromLocalStorage();

  for(let i=0; i<mealIds.length; i++)
  {
    let tmpMeal= await getMealByID (mealIds[i]);
    //console.log(tmpMeal);
    addMealFavorites (tmpMeal);
  }
}

async function getMealByID(id)
{
  const resp= await fetch (`https://www.themealdb.com/api/json/v1/1/lookup.php?i=`+ id);
  
  const respData= await resp.json();
  
  const meal= respData.meals[0];
  //console.log(meal);

  return meal;

}
function addMealFavorites (mealdata)
{

  const favoriteMeal= document.createElement('li');
  favoriteMeal.innerHTML=`
              <img id="fav-img" 
                   src="${mealData.strMealThumb}" 
                   alt="${mealData.strMeal}">
              <span>${mealData.strMeal}</span>
              <button class="clear"><i class="fas fa-window-close"></i></button>`;
  const clearBtn= favoriteMeal.querySelector('.clear');
  clearBtn.addEventListener("click",()=>{
     removeMealFromLocalStorage(mealData.idMeal);
     updateFavoriteMeals();
  })
  
  favoritesElement.appendChild(favoriteMeal);
}


const favId=favoriteMeal.querySelector("#fav-img");
favId.addEventListener("click",()=>{
    OpenMealDetailsPage (mealData)
  
})

async function getMealsBySearch(term)
{
  const resp= await fetch (`https://www.themealdb.com/api/json/v1/1/search.php?s=`+ term);
  
  const respData= await resp.json();
  
  const meals= respData.meals;

  console.log(meals);
  return meals;
}

function OpenMealDetailsPage (mealdata)
{
  window.open("details.html?mealid="+mealData.idMeal,"_self");
}

function initDetailsPage()
{
 const urlparams= new URLSearchParams(window.location.search);
 //console.log(urlParams);
 const mealid= urlParams.get('mealId');
 //console.log(mealId);

 showMealDetails(mealId);
}

async function showMealDetails(mealId)
{
 let tmpMeal= await getMealByID(mealId);
 console.log (tmpMeal);

 const ingredients = [];
 for (let i = 1; i < 20; i++) {
     if (tmpMeal['strIngredient' + i]) {
         ingredients.push(`${tmpMeal['strIngredient' + i]}/${tmpMeal['strMeasure' + i]}`);
     } else {
         // If there are no more ingredients, exit the loop
         break;
     }
 }
 
 for (let i = 0; i < ingredients.length; i++) {
     console.log(ingredients[i]);
 }
 
 const mealdetailsContainer = document.querySelector('.meal-container');
 
 mealdetailsContainer.innerHTML = `
   <a href="meal.html">Home</a>
   <div class="meal-info">
     <div>
       <h1>${tmpMeal.strMeal}</h1>
       <img src="${tmpMeal.strMealThumb}" alt="${tmpMeal.strMeal}">
     </div>
     <div>
       <p>${tmpMeal.strInstructions}</p>
       <ul>
         ${ingredients.map(item => `<li>${item}</li>`).join("")}
         <li>Ingredient /measure</li>
       </ul>
     </div>
   </div>`;
  }