// Global Variables
let employees = [];
const urlAPI = `https://randomuser.me/api/?results=12&inc=name, picture,
email, location, phone, dob &noinfo &nat=US`;
const gridContainer = document.querySelector(".grid-container");
const overlay = document.querySelector(".overlay");
const modalContainer = document.querySelector(".modal-content");
const modalClose = document.querySelector(".modal-close");
const search = document.getElementById("search");
let employeeNames = [];
let activeEmployee;


// Fetch data from API
fetch(urlAPI)
.then(res => res.json())
.then(res => res.results)
.then(displayEmployees)
.then(getNames)
.catch(err => console.log(err))


// Functions

function displayEmployees(employeeData) {

  employees = employeeData;
  let employeeHTML = '';

  employees.forEach((employee, index) => {
    let name = employee.name;
    let email = employee.email;
    let city = employee.location.city;
    let picture = employee.picture;
    employeeHTML += `
      <div class="card" data-index="${index}">
        <img class="avatar" src="${picture.large}" />
        <div class="text-container">
        <h2 class="name">${name.first} ${name.last}</h2>
        <p class="email">${email}</p>
        <p class="address">${city}</p>
        </div>
      </div>
    `;
  });

  gridContainer.innerHTML = employeeHTML;
}

function displayModal(index) {
  let { name, dob, phone, email, location: { city, street, state, postcode
  }, picture } = employees[index];
  let date = new Date(dob.date);
  const modalHTML = `
    <div class="img-container">
      <button class="left-arrow">&larr;</button>
      <img class="avatar" src="${picture.large}" />
      <button class="right-arrow">&rarr;</button>
    </div>
    <div class="text-container">
      <h2 class="name">${name.first} ${name.last}</h2>
      <p class="email">${email}</p>
      <p class="address">${city}</p>
      <hr />
      <p>${phone}</p>
      <p class="address">${street.number} ${street.name}, ${state} ${postcode}</p>
      <p>Birthday:
      ${date.getMonth()}/${date.getDate()}/${date.getFullYear()}</p>
    </div>
  `;

  overlay.classList.remove("hidden");
  modalContainer.innerHTML = modalHTML;
  gridContainer.classList.add("active");
  activeEmployee = parseInt(index);
}

function getNames() {
  employees.forEach((employee) =>
    employeeNames.push(`${employee.name.first} ${employee.name.last}`)
  );
}

function searchEmployees() {
  const employeeCards = document.querySelectorAll(".card");
  const searchTerm = search.value.toLowerCase();

  employeeNames.forEach((employee, i) => {
    if (employee.toLowerCase().indexOf(searchTerm) < 0) {
      employeeCards[i].style.display = "none";
    } else {
      employeeCards[i].style.display = "";
    }
  });
}

function changeEmployee(e) {
  if (e.target.getAttribute("class") === "left-arrow" && activeEmployee > 0) {
    displayModal(activeEmployee - 1);
  } else if (e.target.getAttribute("class") === "right-arrow" &&
    activeEmployee < employees.length - 1) {
    displayModal(activeEmployee + 1);
  } else return;
}

// Event Listeners

gridContainer.addEventListener('click', e => {
  if (e.target !== gridContainer) {
    const card = e.target.closest(".card");
    const index = card.getAttribute('data-index');

    displayModal(index);
  }
});

modalClose.addEventListener('click', () => {
  overlay.classList.add("hidden");
  gridContainer.classList.remove("active");
});

search.addEventListener("keyup", e => searchEmployees(e));

overlay.addEventListener("click", e => changeEmployee(e));