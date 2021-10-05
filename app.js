const apiKey1 = "ac4d8af28a8c864ae7422cba18ba1e76"; //~  мой ключ 
// const weatherReqtUrl = `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&units=metric&lang=ru&appid=${apiKey}`
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
/* WEATHER */
const requestIP = fetch(URL[0], requestOptions)// "//www.geoplugin.net/json.gp",
requestIP
  .then( data => {
    return data.json()
  })
  .then (data => {
    // console.log( "========= погода =========" );
    const lat = data.geoplugin_latitude 
    const lon = data.geoplugin_longitude 
    const forc8ReqtUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly&units=metric&lang=ru&appid=${apiKey1}`;
    //
    const selectedCity = data.geoplugin_city
    const weatherReqtUrl = `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&units=metric&lang=ru&appid=${apiKey1}`
    const requestWeather = fetch(weatherReqtUrl)
    requestWeather
      .then(data2 => {
        return data2.json()
      })
      .then(data2 => {
        const curTime = new Date(data2.dt * 1000).toLocaleString()
        // 
        const hRise = new Date(data2.sys.sunrise * 1000).getHours()
        const mRise = (new Date(data2.sys.sunrise * 1000).getMinutes() < 10) ? `0${new Date(data2.sys.sunrise * 1000).getMinutes()}` : new Date(data2.sys.sunrise * 1000).getMinutes()
        // 
        const hSet = new Date(data2.sys.sunset * 1000).getHours()
        const mSet = (new Date(data2.sys.sunset * 1000).getMinutes() < 10) ? `0${new Date(data2.sys.sunset * 1000).getMinutes()}` : new Date(data2.sys.sunset * 1000).getMinutes()
        // 
        const sunrise = hRise + " : " + mRise
        const sunset = hSet + " : " + mSet
        // 
        const asideBlock = `
          <div class="aside-header">
            <img class="aside__img" src="http://openweathermap.org/img/w/${data2.weather[0].icon}.png" alt="">
            <div class="aside__descr">${data2.weather[0].description}</div>
          </div>
          <div class="aside__city">${data2.name}</div>
          <div class="aside__temp">${data2.main.temp.toFixed(0)} <small>&#8451;</small></div>
          <div class="aside-max-min">
            <div class="aside__temp-max"> <sub>max</sub>  ${data2.main.temp_max.toFixed(0)} &#8451;&nbsp;/&nbsp;</div>
            <div class="aside__temp-min">	&#32; ${data2.main.temp_min.toFixed(0)} &#8451;<sub> min</sub></div>
          </div>
          <div class="aside__sunrise-sunset">
            <div class="aside__sunrise">${sunrise}</div>
            <div class="aside__radius"> <span class="aside__radius-sun"></span> </div>
            <div class="aside__sunset">${sunset}</div> 
          </div> `
        document.querySelector('.aside').insertAdjacentHTML("afterbegin", asideBlock)
        return data2
      })
      const requestForcastWeather = fetch(forc8ReqtUrl)
      requestForcastWeather
        .then( dataForc => dataForc.json() )
        .then( dataForc => {
          // console.log( "===== прогноз на 8 дней =====" )
          // console.log( dataForc )
          dataForc.daily.forEach(el => {
            const optionsDay = {
              weekday:"short",//  и ."narrow" "short" "long"
            }
            const optionsDate = {
              day:"numeric",// и "2-digit".
              month:"numeric",// "2-digit", "narrow", "short" и "long".
            }
            const day = new Date(el.dt * 1000).toLocaleDateString("ru-RU", optionsDay)
            const date = new Date(el.dt * 1000).toLocaleDateString("ru-RU", optionsDate)

            const forcastItem = `
              <div class="forcast__item">
              <div class="forcast__item-title">
                <span>${day.toUpperCase()}</span> <span>${date}</span>
              </div>
              <div class="forcast__item-content">
              <img src="http://openweathermap.org/img/w/${el.weather[0].icon}.png" alt="">
                <p>${el.weather[0].description}</p>
              </div>
              <div class="forcast__item-footer">
                <p class="forcast__item-footer-temp js-temp-day">${el.temp.day.toFixed(0)} &#8451; <sub class="js-temp-night">${el.temp.night.toFixed(0)} &#8451;</sub> </p>
                <p class="forcast__item-footer-wind"> ветер ${el.wind_speed.toFixed(0)} м/с <span style="transform: rotateZ(${el.wind_deg}deg);">&#8593;</span></p>
              </div>
            </div>`
            document.querySelector('.forcast__wrapper').insertAdjacentHTML('beforeend', forcastItem)
          })
        })
  })
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
/* SLIDER */
setTimeout(() => {
  theme()
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
}, 1000);
function theme() {
  let body = document.querySelector('body')
  // 
  let block = document.createElement('div')
  block.classList.add('btn-wrapper')
  document.querySelector('body').appendChild(block)
  // 
  let btn = document.createElement('btn')
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






























































