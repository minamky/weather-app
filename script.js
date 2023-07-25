//DOM Elements

const form = document.querySelector('#search-form');
const input = document.querySelector('#search-term');
const msg = document.querySelector('.form-msg')
const list = document.querySelector('.cities')


//API
const apiKey = "5269fa8161bbc92436a5431147066f4e"


form.addEventListener('submit', e => {
  e.preventDefault()

  msg.textContent = ''
  msg.classList.remove('visible')

  let inputVal = input.value

  const listItemsArray = Array.from(list.querySelectorAll('.ajax-section .cities'));

  if (listItemsArray.length > 0) {
    const filteredArray = listItemsArray.filter(el => {
      let content = ''
      let cityName = el.querySelector('.city-name').textContent.toLowerCase()
      let cityCountry = el.querySelector('.city_country').textContent.toLowerCase()

      //check for <city, country> format
      if (inputVal.includes(',')) {
        if (inputVal.split(',')[1].length > 2) {
          inputVal = inputVal.split(',')[0]
          content = cityName
        } else {
          content = '${cityName},${cityCountry}'
        }
      } else {
        content = cityName
      }

      return content = inputVal.toLowerCase()
    })

    if (filteredArray.length > 0) {
      msg.textContent = 'You already know the weather for ' + inputVal;
      msg.classList.add('visible')

      form.reset();
      input.focus();

      return;
    }
  }
  //AJAX magic
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;
  
  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.cod == '404') {
        throw new Error('${data.cod}, ${data.message}')
      }

      const {main, name, sys, weather} = data

      console.log(weather[0]['icon']);
      console.log(sys);

      const icon = "images/"+ weather[0]['icon'] + ".png"
      
      const li = document.createElement("li");
      li.classList.add("city");
      const markup = ` 
      <figure> 
      <img class="city-icon" src=${icon} alt=${weather[0]["main"]}> 
      </figure> 
      <div>
      <h2>${Math.round(main.temp)}<sup>C</sup></h2> 
      <p class="city_conditions">${weather[0]["description"].toUpperCase()}</p> 
      <h3><span class="city-name">${name}</span><span class="city_country">${sys.country}</span></h3>
      </div>
      `;
      li.innerHTML = markup;
      list.appendChild(li);
    })

    .catch(() => {
      msg.textContent = 'Please search for a valid city!'
      msg.classList.add("visible")
    })

    msg.textContent = ''
    form.reset()
    input.focus()
})