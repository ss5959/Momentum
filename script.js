// 랜덤 배경 이미지
const backgrounds = [
  'url(https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=2600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)', 
  'url(https://images.unsplash.com/photo-1505699261378-c372af38134c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)', 
  'url(https://images.unsplash.com/photo-1503389152951-9f343605f61e?q=80&w=2998&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)'
];
document.body.style.backgroundImage = backgrounds[Math.floor(Math.random() * backgrounds.length)];

// 실시간 시계
function updateClock() {
  const timeElement = document.getElementById('time');
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  timeElement.textContent = `${hours}:${minutes}:${seconds}`;
}
setInterval(updateClock, 1000);

// 사용자 이름으로 로그인
const nameFormContainer = document.getElementById('name-form-container');
const nameForm = document.getElementById('name-form');
const nameInput = document.getElementById('name-input');
const greeting = document.getElementById('greeting');

function getUserName() {
  const userName = localStorage.getItem('userName');
  if (userName) {
    nameFormContainer.style.display = 'none';
    greeting.textContent = `안녕하세요, ${userName}님!`;
  } else {
    nameFormContainer.style.display = 'block';
  }
}

nameForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const newUserName = nameInput.value;
  if (newUserName) {
    localStorage.setItem('userName', newUserName);
    greeting.textContent = `안녕하세요, ${newUserName}님!`;
    nameFormContainer.style.display = 'none';
  }
});

getUserName();

// 투두리스트
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
let todos = JSON.parse(localStorage.getItem('todos')) || [];

function renderTodos() {
  todoList.innerHTML = '';
  todos.forEach((todo, index) => {
    const li = document.createElement('li');
    li.textContent = todo;

    // 삭제 버튼
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'X';
    deleteButton.addEventListener('click', () => {
      todos.splice(index, 1);
      localStorage.setItem('todos', JSON.stringify(todos));
      renderTodos();
    });

    li.appendChild(deleteButton);
    todoList.appendChild(li);
  });
}

todoInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && todoInput.value) {
    todos.push(todoInput.value);
    localStorage.setItem('todos', JSON.stringify(todos));
    renderTodos();
    todoInput.value = '';
  }
});

renderTodos();

// 현재 위치 및 날씨
const weatherElement = document.getElementById('weather');

function getLocationAndWeather() {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      console.log('Latitude:', lat, 'Longitude:', lon);

      const apiKey = '587ae190500fc912aed52217cf79e939';
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=kr`;

      fetch(weatherUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error('날씨 정보를 불러오는 데 문제가 발생했습니다.');
          }
          return response.json();
        })
        .then(data => {
          const temperature = data.main.temp;
          const weatherDescription = data.weather[0].description;
          weatherElement.textContent = `현재 온도: ${temperature}°C, 날씨: ${weatherDescription}`;
        })
        .catch(error => {
          console.error('Error fetching weather data:', error);
          weatherElement.textContent = '날씨 정보를 불러올 수 없습니다.';
        });
    },
    (error) => {
      console.error('Error getting location:', error);
      switch (error.code) {
        case error.PERMISSION_DENIED:
          console.log('사용자가 위치 정보 제공을 거부했습니다.');
          break;
        case error.POSITION_UNAVAILABLE:
          console.log('위치 정보를 사용할 수 없습니다.');
          break;
        case error.TIMEOUT:
          console.log('위치 정보를 가져오는 요청이 시간 초과되었습니다.');
          break;
        default:
          console.log('위치 정보 오류가 발생했습니다.');
      }
      weatherElement.textContent = '위치 정보를 불러올 수 없습니다.';
    },
    { timeout: 30000 }
  );
}

getLocationAndWeather();
