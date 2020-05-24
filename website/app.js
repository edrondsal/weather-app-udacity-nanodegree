/*--------------------------------------------------------
App code for Wheather Journal App. UDACITY Project - Front End Developper Nanodegree
version: 0.0.1
created on: 23/05/20
last modified: 24/05/20
Updates:
23/05/20    File Creation
24/05/20    Code event, document constructor
author: E. RONDON
----------------------------------------------------------*/


/**
 * Global Variables
 * 
*/
const baseUrlApiByCity = 'http://api.openweathermap.org/data/2.5/weather?q=';
const baseUrlApiByZip = 'http://api.openweathermap.org/data/2.5/weather?zip=';
const units = '&units=metric';
const apiKey = '&appid=a5f37101f342449c81da86c0245eea75';
const SEARCH_BY_CITY=0;
const SEARCH_BY_ZIP=1;
const serverEndPoint = '/weatherdata';
let weatherApp;

/**
 * End Global Variables
 * Start Helper Functions
 * 
*/

/**
* @description Constructor of the Web App
*/
function WeatherApp(){
    
    let typeSearch = SEARCH_BY_CITY; 

    this.inputFormSearchByCity = document.getElementById('input-by-city');
    this.inputFormSearchByZip = document.getElementById('input-by-zip-code');
    this.inputCity = document.getElementById('city-name-input');
    this.inputZipCode = document.getElementById('zip-code-input');
    this.inputFeelings = document.getElementById('today-feelings-input');
    this.menuSearchByCity = document.getElementById('search-by-city-menu');
    this.menuSearchByZip = document.getElementById('search-by-zip-menu');
    this.generateButton = document.getElementById('generate-button');
    this.temperatureCardsContainer = document.getElementById('temperature-cards-container');

    this.inputFormSearchByZip.classList.remove('input-flex-division');
    this.inputFormSearchByZip.classList.add('hidden_item');
    this.menuSearchByCity.classList.remove('navbar-item-style');
    this.menuSearchByCity.classList.add('navbar-item-style-active');  
    this.toggleMenu = function(event) {
        const targetId = event.target.id;
        if(targetId == this.menuSearchByCity.id){
            typeSearch = SEARCH_BY_CITY;
            this.inputFormSearchByZip.classList.remove('input-flex-division');
            this.inputFormSearchByCity.classList.remove('hidden_item');
            this.menuSearchByCity.classList.remove('navbar-item-style');
            this.menuSearchByZip.classList.remove('navbar-item-style-active');
                
            this.inputFormSearchByZip.classList.add('hidden_item');
            this.inputFormSearchByCity.classList.add('input-flex-division');
            this.menuSearchByCity.classList.add('navbar-item-style-active');
            this.menuSearchByZip.classList.add('navbar-item-style');
        }else if(targetId == this.menuSearchByZip.id){
            typeSearch = SEARCH_BY_ZIP;
            this.inputFormSearchByCity.classList.remove('input-flex-division');
            this.inputFormSearchByZip.classList.remove('hidden_item');
            this.menuSearchByZip.classList.remove('navbar-item-style');
            this.menuSearchByCity.classList.remove('navbar-item-style-active');
    
            this.inputFormSearchByCity.classList.add('hidden_item');
            this.inputFormSearchByZip.classList.add('input-flex-division');
            this.menuSearchByCity.classList.add('navbar-item-style');
            this.menuSearchByZip.classList.add('navbar-item-style-active');
        }
    };
    this.setButtonCallback = function(callback){
        this.generateButton.addEventListener('click',callback);
    };
    this.setMenuCallback = function(callback){
        document.getElementById('navigaton-bar').addEventListener('click',callback,true);
    };
    this.appendCard = function(card){
        this.temperatureCardsContainer.appendChild(card);
    };
    this.clearCards= function(){
        this.temperatureCardsContainer.innerHTML = '';
    }
    this.getApiUrl = function(){
      if(typeSearch==SEARCH_BY_CITY){
          return baseUrlApiByCity+this.inputCity.value+units+apiKey;
      }else{
          return baseUrlApiByZip+this.inputZipCode.value+units+apiKey;
      }
    };
    this.getWeatherData = function(response){
        let weatherdata = new WeatherData(response.name,response.main.temp);
        weatherdata.setUserInput(this.inputFeelings.value);
        return weatherdata;
    }
}

/**
* @description Constructor of the WeatherData
* @param {String} city - The city name
* @param {Number} temperature - The temperature requested
*/
function WeatherData(city,temperature){
    this.key = city;
    const date = new Date();
    this.data = {
        temperature: temperature,
        date:   date.toLocaleDateString(),
        userInput: ''
    };
    this.setUserInput = function(userInput){
        this.data.userInput = userInput;
    }
}

/**
* @description helper function to use fetch to realize a GET request
* @param {String} url - The url to realiaze the GET request.
*/
async function getData(url = '') {
    const response = await fetch(url);
    try{
        return response.json();
    }catch(error){
        console.log("error",error);
        return {};
    }

}

/**
* @description helper function to use fetch to realize a POST request
* @param {String} url - The url to realiaze the POST request.
* @param {Object} data - The data to send ans body of the POST request
*/
async function postData(url = '',data= {}) {
    const response = await fetch(url, {
        method: 'POST', 
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), 
      });
  
    try {
        const newData = await response.json();
        return newData;
    }catch(error) {
        console.log("error", error);
    }
}

/**
 * End Helper Functions
 * Begin Main Functions
 * 
*/

/**
* @description Function called when the document is loaded in order to realize initializations of the app prototype
* @param {Event} event - The event associated with the event listener
*/
function documentLoaded(event) {
    weatherApp = new WeatherApp();
    weatherApp.setButtonCallback(listenerButton);
    weatherApp.setMenuCallback(listenerMenuClick);
}

/**
* @description Function called when there is a click in the navigation bar
* @param {Event} event - The event associated with the event listener
*/
function listenerMenuClick(event) {
    weatherApp.toggleMenu(event);
}

/**
* @description Function called when there is a click in the button
* @param {Event} event - The event associated with the event listener
*/
function listenerButton(event){
    getData(weatherApp.getApiUrl())
    .then(response=>{
        postData(serverEndPoint,weatherApp.getWeatherData(response))    
        .then(
            updateUI()
        )
    })
}

/**
* @description Function called to update the UI
*/
async function updateUI(){
    getData(serverEndPoint)
    .then(response=>{
        weatherApp.clearCards();
        try{
            const fragment = document.createDocumentFragment();
            const divElement = document.createElement('div');
            divElement.classList.toggle('content-flex-container');

            Object.keys(response).forEach( key =>{
                const cardElement = document.createElement('div');
                cardElement.classList.toggle('card-flex-item');
                const stringCard = `
                    <h3>${response[key].temperature} °C</h3>
                    <p>${key} - ${response[key].date}</p>
                    <b>My Feelings Input:</b>
                    <p>${response[key].userInput}</p>
                    `;
                cardElement.innerHTML = stringCard;
                divElement.appendChild(cardElement);
            });

            fragment.appendChild(divElement);
            weatherApp.appendCard(fragment);
        }catch(error){
            console.log('error',error);
        }
    });
}


/**
 * End Main Functions
 * Begin Global Events
 * 
*/

//DOMContentLoaded event
document.addEventListener('DOMContentLoaded', documentLoaded);
