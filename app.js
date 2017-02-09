const weatherURL = "http://api.openweathermap.org/data/2.5/weather";
const weatherKEY = "f07213d94e6f52cf12b79a83ca310d53";
const giphyEndpoint = "http://api.giphy.com/v1/gifs/search";
const giphyKey = "dc6zaTOxFJmzC";

var appState = {
	weatherKeyword: " ",
	gifArray: [],
  gifUrlArray: [],
}
/* Modify State Function */
function setWeatherKeyword (state, word) {
  state.weatherKeyword = word;

}

function setGiphyArray (state, item1, item2) {
  state.gifArray = item1;
  state.gifUrlArray = item2;
}

/* API Calling Functions*/
function getWeatherData(zip) {
  var query = {
    zip : zip,
    APPID : weatherKEY,
  }
  $.getJSON(weatherURL, query, weatherCallback);
}

function getGiphyData (state) {
  var query = {
    q : state.weatherKeyword,
    api_key : giphyKey,
  }
  $.getJSON(giphyEndpoint, query, giphyCallback)
}
/* API Handling Functions*/
function weatherCallback (data) {
  let weatherWord = data.weather[0].description;
  setWeatherKeyword(appState, weatherWord);
  getGiphyData(appState);
}

function giphyCallback(data) {
  let gifArray = [];
  let gifUrls = [];
  for (var i = 0; i < 6; i++) {
  	gifArray.push(data.data[i].images.fixed_height.url);
    gifUrls.push(data.data[i].url);
  }
  setGiphyArray(appState, gifArray, gifUrls);
  renderGifs(appState);
}
/* Rendering Functions */
function renderGifs (state) {
  var newElement = appState.gifArray.map(function (gif, i) {
    let gifUrl = appState.gifUrlArray[i];
  	return `<a href="${gifUrl}"><img src="${gif}" alt="gif"></a>`;
  });
  $(".results-to-show").html(newElement);
}



$(function(){
  $('button').on('click', function(e){
    e.preventDefault();
    let $inputZip = $('.term-to-search').val();
    getWeatherData($inputZip);
    console.log($inputZip);
  });
});















/*
create the first representation of the state
User inputs location into a form and push button
return current weather information with 5 gif that corresponds to the weather keyword
create an event listener to capture the location
call weather API for information on current location weather
extract the keyword
call the giphy API with the extracted keyword from the weather API
extract the 5 gifs that correspond to the keyword
modify the state to show the 5 gifs on the page
reder function that moves the 5 gifs from the state to HTML

API Capstone Project Requirement

Search/Select

Required: App should allow the user to search for an item
Bonus: Auto-complete or type-ahead
Bonus: Search as you type
List

Required: List the results from the search
Required: User can click an item to see "details"
Bonus: Pagination
Bonus: Sorting or Filtering
Details

Required: User sees details based on selection from list
Bonus: integrate additional API like maps or form
Requirements for API

Must support CORS
JSONP is not an option
Test it immediately: send a $.getJSON() request in your app.js and make sure you get a response
No oauth
Should support https - required if deploying to hosts that use https. And required if/when integrating into authentication

Giphy API: https://api.giphy.com/
Open Weather: https://openweathermap.org/api
*/
