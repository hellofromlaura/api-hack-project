const weatherURL = "http://api.openweathermap.org/data/2.5/weather";
const weatherKEY = "f07213d94e6f52cf12b79a83ca310d53";
const giphyEndpoint = "http://api.giphy.com/v1/gifs/search";
const giphyKey = "dc6zaTOxFJmzC";
const giphyTrendingEndpoint = "http://api.giphy.com/v1/gifs/trending";

var appState = {
	weatherKeyword: " ",
  currentTemp: "... let's find out",
	gifArray: [],
  gifUrlArray: [],
}

/* Modify State Functions */

function setWeatherKeyword (state, word) {
  state.weatherKeyword = word;
}

function setGiphyArray (state, item1, item2) {
  state.gifArray = item1;
  state.gifUrlArray = item2;
}

function setCurrentTemp (state, num) {
  state.currentTemp = num;
}

/* API Calling Functions*/

function getRandomGif () {
  var query = {
    api_key : giphyKey,
    limit: 1,
  }
  $.getJSON(giphyTrendingEndpoint, query, giphyCallback)
}

function getWeatherData (zip) {
  var query = {
    zip : zip,
    APPID : weatherKEY,
  }
  $.getJSON(weatherURL, query, weatherCallback);
}

function getGiphyData (state) {
  var query = {
    q : `${state.weatherKeyword} weather`,
    api_key : giphyKey,
    limit: 6,
  }
  $.getJSON(giphyEndpoint, query, giphyCallback)
}

/* API Handling Functions*/

function weatherCallback (data) {
  let weatherWord = data.weather[0].description;
  let currentTempKelvin = data.main.temp;
  let currentTempFahr = (currentTempKelvin * 9/5 - 459.67).toFixed(1);
  setCurrentTemp (appState, currentTempFahr)
  setWeatherKeyword(appState, weatherWord);
  getGiphyData(appState);
}

function giphyCallback(data) {
  let gifArray = [];
  let gifUrls = [];
  for (var i = 0; i < data.data.length; i++) {
  	gifArray.push(data.data[i].images.fixed_height.url);
    gifUrls.push(data.data[i].url);
  }
  setGiphyArray(appState, gifArray, gifUrls);
  renderGifs(appState);
}

/* Rendering Functions */

function renderGifs (state) {
  $('.random').addClass('hidden');
  $('.gifs').removeClass('hidden');
  var newElement = appState.gifArray.map(function (gif, i) {
    let gifUrl = appState.gifUrlArray[i];
    let activeClass = '';
    if (i === 0) {
      activeClass = 'active'; // add class active to only the first carousel item
    }
    return `<div class="item ${activeClass}">
      <img src="${gif}" width="500px" alt="" />
      <div class="carousel-caption">
        <h2>Current Temperature is ${state.currentTemp}</h2>
      </div>
    </div>`
  });
  $(".carousel-inner").html(newElement);
}

/* Form Validation for 5 digit zip codes*/

function validateZip (num) {
    if (num.match(/^\d{5}$/)) {
      getWeatherData(num);
    }
    else {
      alert("Zip code not valid");
      return false;
    }
}

/* Document Ready with Event Handler function */

$(function(){
  getRandomGif();
  $('button').on('click', function(e){
    e.preventDefault();
    let $inputZip = $('.term-to-search').val();
    validateZip($inputZip);
    $('.term-to-search').val('');
  });
});
