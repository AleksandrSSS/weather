const apiKey1 = "ac4d8af28a8c864ae7422cba18ba1e76"; //~  мой ключ 
// const forcast8DaysUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly&units=metric&lang=ru&appid=${apiKey1}`;
// const weatherReqtUrl = `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&units=metric&lang=ru&appid=${apiKey1}`
// 
const URL = [
  "//www.geoplugin.net/json.gp",
  "ip-api.com/json",
  "api.ipify.org?format=json",
]
const requestOptions = {
  method: 'GET',
  redirect: 'follow'
}

/* GET city, latitude, longitude from IP */
const responseLonLatCity = async () => {
  const requestIpTest = await fetch(URL[0], requestOptions)// "//www.geoplugin.net/json.gp",
  const response = await requestIpTest.json()
  const valObj = {
    city: response.geoplugin_city,
    lat: response.geoplugin_latitude,
    lon: response.geoplugin_longitude
  }
  return valObj
}
/* WEATHER */
const responseWeather = responseLonLatCity().then( data => { // console.log( data );//{city: 'Kyiv', lat: '50.4333', lon: '30.5167'}
  
  weatherResponse(data)
  weatherForcastResponse(data)
  slider() 
  theme()

  async function weatherResponse(data) {
    const weatherReqtUrl = `https://api.openweathermap.org/data/2.5/weather?q=${data.city}&units=metric&lang=ru&appid=${apiKey1}`
    const getWeatherObj = await fetch(weatherReqtUrl) /* .then(data => {console.log(data)}) */
    const weather = await getWeatherObj.json() /* .then(data => {console.log(data)}) */
    // console.log(weather);
    renderWeather( weather )    
    return weather
  }
  // 
  async function weatherForcastResponse(data) {
    const forc8ReqtUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${data.lat}&lon=${data.lon}&exclude=current,minutely,hourly&units=metric&lang=ru&appid=${apiKey1}`;
    const getWeatherObj = await fetch(forc8ReqtUrl) /* .then(data => {console.log(data)}) */
    const weatherForcast = await getWeatherObj.json() /* .then(data => {console.log(data)}) */
    // console.log(weatherForcast);
    weatherForcast.daily.forEach(async el => {
      renderForcastWeather( el )
    })
    return weatherForcast
  }
})
/* choose-location */
const getLocation = document.querySelector('.aside__location')
getLocation.addEventListener('click', () => {
  document.querySelector('body').style.overflow = 'hidden'
  // ? get city of Ukraine
  let countries = fetch('https://countriesnow.space/api/v0.1/countries')
  countries
    .then( data => data.json() )// parse JSON
    .then( data => data.data )// get array
    .then( data => { // get object of array { country == 'Ukraine' }
      let arr = data.filter( e => {
        return e.country == 'Ukraine'
      });
      return arr[0].cities 
    })
    .then(data => { // add form for change location
      const form = document.createElement('form')
      form.classList.add('choose-location')
      data.forEach( (e, i) => {
        const locationBTN = `
        <button class="item-location" value="${e}"> ${e} </button>`
        form.innerHTML += locationBTN
      })
      document.querySelector('body').insertAdjacentElement('afterbegin', form)
      return form
    })
    .then(form => { // change location & render new dataValue
      let val = form.addEventListener('submit', async (event) => {
        event.preventDefault(); event.stopPropagation();
        // 
        form.remove()
        const city = event.submitter.value
        const weatherReqtUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=ru&appid=${apiKey1}`
        const response = await fetch(weatherReqtUrl)
        const result = await response.json()
        renderWeather( result )
        // 
        const forc8ReqtUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${result.coord.lat}&lon=${result.coord.lon}&exclude=current,minutely,hourly&units=metric&lang=ru&appid=${apiKey1}`;
        const getWeatherObj = await fetch(forc8ReqtUrl) /* .then(data => {console.log(data)}) */
        const weatherForcast = await getWeatherObj.json() /* .then(data => {console.log(data)}) */
        //
        document.querySelector('.forcast__wrapper').innerHTML = ``
        weatherForcast.daily.forEach( el => {
          renderForcastWeather( el )
        })
        // 
        document.querySelector('body').style = ''
        // 
        console.log(city);
        console.log( result );
        console.log( weatherForcast.daily );
        // 
        return result
      })
    })
})
/*  */
function renderWeather( obj ) {
  const hRise = new Date(obj.sys.sunrise * 1000).getHours()
  const mRise = (new Date(obj.sys.sunrise * 1000).getMinutes() < 10) 
    ? `0${new Date(obj.sys.sunrise * 1000).getMinutes()}` 
    : new Date(obj.sys.sunrise * 1000).getMinutes()
  // 
  const hSet = new Date(obj.sys.sunset * 1000).getHours()
  const mSet = (new Date(obj.sys.sunset * 1000).getMinutes() < 10) 
    ? `0${new Date(obj.sys.sunset * 1000).getMinutes()}` 
    : new Date(obj.sys.sunset * 1000).getMinutes()
  // 
  const sunrise = hRise + " : " + mRise
  const sunset = hSet + " : " + mSet
  // 
  const asideBlock = `
    <div class="aside-header">
      <img class="aside__img" src="http://openweathermap.org/img/w/${obj.weather[0].icon}.png" alt="">
      <div class="aside__descr">${obj.weather[0].description}</div>
    </div>
    <div class="aside__city">${obj.name}</div>
    <div class="aside__temp">${obj.main.temp.toFixed(0)} <small>&#8451;</small></div>
    <div class="aside__sunrise-sunset">
      <div class="aside__sunrise">${sunrise}</div>
      <div class="aside__radius"> <span class="aside__radius-sun"></span> </div>
      <div class="aside__sunset">${sunset}</div> 
    </div>`
  document.querySelector('.aside').innerHTML = asideBlock
}
/*  */
function renderForcastWeather( item ) {
  const optionsDay = {
    weekday:"short",//  и ."narrow" "short" "long"
  }
  const optionsDate = {
    day:"numeric",// и "2-digit".
    month:"numeric",// "2-digit", "narrow", "short" и "long".
  }
  const day = new Date(item.dt * 1000).toLocaleDateString("ru-RU", optionsDay)
  const date = new Date(item.dt * 1000).toLocaleDateString("ru-RU", optionsDate)
  const forcastItem = `
    <div class="forcast__item">
      <div class="forcast__item-title">
        <span>${day.toUpperCase()}</span> <span>${date}</span>
      </div>
      <div class="forcast__item-content">
      <img src="http://openweathermap.org/img/w/${item.weather[0].icon}.png" alt="">
        <p>${item.weather[0].description}</p>
      </div>
      <div class="forcast__item-footer">
        <p class="forcast__item-footer-temp js-temp-day">${item.temp.max.toFixed(0)} &#8451; <sub class="js-temp-night">${item.temp.min.toFixed(0)} &#8451;</sub> </p>
        <p class="forcast__item-footer-wind"> ветер ${item.wind_speed.toFixed(0)} м/с <span style="transform: rotateZ(${item.wind_deg}deg);">&#8593;</span></p>
      </div>
    </div>`
  document.querySelector('.forcast__wrapper').innerHTML += forcastItem
}
/* SLIDER */
function slider() {
  let offset = 0
  const block = document.querySelector('.forcast__wrapper')
  block.style.left = offset + `px`
  const next = document.querySelector('.next')
  
  const forcast = document.querySelector('.forcast')
  
  next.addEventListener('click', () => {
    offset += 200
    if (offset > (block.offsetWidth - forcast.offsetWidth + 200) ) {
      offset = 0
    }
    block.style.left = -offset + `px`
  })
}
/* THEME toggler */
function theme() {
  const body = document.querySelector('body')
  // 
  const block = document.createElement('div')
  block.classList.add('btn-wrapper')
  document.querySelector('.app-wrapper').appendChild(block)
  // 
  const btn = document.createElement('btn')
  btn.classList.add('btn-theme')
  btn.innerText = 'light'
  block.appendChild(btn)
  // 
  btn.addEventListener('click', ()=> {
    body.classList.toggle('light')
    btn.classList.toggle('light-theme')
    if ( body.className == 'light' ) {
      btn.innerText = 'dark'
      localStorage.setItem('light', '#fff');
    } else {
      btn.innerText = 'light'
      localStorage.removeItem('light');
    }
  })
  // 
  if ( localStorage.getItem('light') == '#fff' ) {
    body.classList.add('light')
    btn.innerText = 'dark'
    localStorage.setItem('light', '#fff');
  } else {
    body.classList.remove('light')
    btn.innerText = 'light'
    localStorage.removeItem('light');
  }
}
/* CLOCK */
const blockClock = document.querySelector('.main__clock')
setInterval(() => {
  let d = new Date()
  // console.log(d);
  let h = d.getHours() < 10 ? '0' + d.getHours() : d.getHours()
  let m = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()
  let s = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds()
  blockClock.innerHTML = `${h}: ${m}: ${s}`
}, 1000);





























































