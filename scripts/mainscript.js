"use strict";

const studentArray = [];
let bloodArray = [];
window.addEventListener("DOMContentLoaded", init);

// creating the student object
const studentObject = {
  firstName: "",
  lastName: "",
  middleName: "",
  nickName: "",
  image: "",
  gender: "",
  picture: "",
  house: "",
  bloodStatus: "",
  expelled: false,
  prefect: false,
  inquisitor: false,
};

const settings = {
  filterBy: "all",
  sortBy: "firstName",
  currentCount: 0,
  isHacked: false,
};

function init() {
  const urlStudentSetRawData =
    "https://petlatkea.dk/2021/hogwarts/students.json";
  const urlBloodRawData = "https://petlatkea.dk/2021/hogwarts/families.json";

  async function loadData() {
    await fetchJson(urlBloodRawData, cleanBlood);
    fetchJson(urlStudentSetRawData, handleStudentList);
  }
  loadData();
  // GLOBAL EVENT LISTENERS
  document.querySelector("#sort").addEventListener("change", sortStudents);
  document.querySelector("#filter").addEventListener("change", filterStudents);
}

async function fetchJson(url, callback) {
  return fetch(url)
    .then((response) => response.json())
    .then((data) => callback(data));
}

function handleStudentList(data) {
  data.forEach(cleaningData);
  buildList();
}

function buildList() {
  // studentArray.forEach(showStudentList);
  const currentList = filterList(studentArray);
  const sortedList = currentList.sort(function (a, b) {
    return a.firstName.localeCompare(b.firstName);
  });
  console.log(sortedList);
  displayList(sortedList);
}

function displayList(student) {
  // clear the list
  document.querySelector(".section-wrapper").innerHTML = "";
  // build a new list
  student.forEach(showStudentList);
}

function showStudentList(student) {
  const template = document.querySelector("#student-list-template").content;
  const parent = document.querySelector(".section-wrapper");
  const clone = template.cloneNode(true);
  clone.querySelector(
    ".student-properties"
  ).textContent = `${student.firstName}  ${student.lastName} `;
  clone.querySelector(".student-house img").src =
    "assets/" + student.house.toLowerCase() + ".png";
  clone.querySelector(".student-picture img").src = "assets/" + student.image;

  // event listeners
  clone.querySelector(".show-more-button").addEventListener("click", () => {
    document.querySelector(".pop-up-first-name").textContent =
      "First Name: " + student.firstName;
    document.querySelector(".pop-up-last-name").textContent =
      "Last Name: " + student.lastName;
    document.querySelector(".pop-up-gender").textContent =
      "Gender: " + student.gender;
    document.querySelector(".house-image-pop-up").src =
      "assets/" + student.house.toLowerCase() + ".png";
    document.querySelector(".house-image-pop-up").alt = student.house;
    document.querySelector(".student-picture img").src =
      "assets/" + student.image;
    document.querySelector(".pop-up-blood-status").textContent =
      "Blood Status: " + student.bloodStatus;
    document
      .querySelector(".student-details-pop-up")
      .classList.add("student-details-pop-up-visible");
  });

  parent.appendChild(clone);
}
document.querySelector(".pop-up-close").addEventListener("click", () => {
  document
    .querySelector(".student-details-pop-up")
    .classList.remove("student-details-pop-up-visible");
});

// Cleaning Data
function cleaningData(data) {
  let firstName, lastName, middleName, nickName, bloodStatus;

  const nameArray = data.fullname.trim().split(" ");
  const house = capitalize(data.house.trim());
  const gender = capitalize(data.gender.trim());
  firstName = nameArray[0];
  if (nameArray.length === 2) {
    lastName = nameArray[1];
  } else if (nameArray.length === 3) {
    if (nameArray[1].includes(`"`)) {
      nickName = nameArray[1];
      lastName = nameArray[2];
    } else {
      middleName = nameArray[1];
      lastName = nameArray[2];
    }
  }
  firstName = capitalize(firstName);
  lastName = capitalize(lastName);
  middleName = capitalize(middleName);
  nickName = capitalize(nickName);

  // assigning images for each cases
  let image;

  if (lastName === undefined) {
    image = "./placeholder-image.png";
  } else {
    image = lastName.toLowerCase() + "_" + firstName[0].toLowerCase() + ".png";
    if (lastName.toLowerCase().includes("patil")) {
      if (firstName.toLowerCase().includes("padma")) {
        image = "./patil_padma.png";
      } else if (firstName.toLowerCase().includes("parvati")) {
        image = "./patil_parvati.png";
      }
    }
    if (lastName.includes("-")) {
      image = `./${lastName
        .substring(lastName.lastIndexOf("-") + 1)
        .toLowerCase()}_${firstName.charAt(0).toLowerCase()}.png`;
    }
  }

  let pureBlood = bloodArray.pure;
  let halfBlood = bloodArray.half;
  if (halfBlood.includes(lastName)) {
    bloodStatus = "HalfBlood";
  } else if (pureBlood.includes(lastName)) {
    bloodStatus = "Pureblood";
  } else {
    bloodStatus = "Muggle";
  }

  let studentObj = Object.create(studentObject);
  studentObj.firstName = firstName;
  studentObj.lastName = lastName;
  studentObj.middleName = middleName;
  studentObj.nickName = nickName;
  studentObj.gender = gender;
  studentObj.house = house;
  studentObj.image = image;
  studentObj.expelled = false;
  studentObj.inquisitor = false;
  studentObj.prefect = false;
  studentObj.bloodStatus = bloodStatus;
  studentArray.push(studentObj);
}

function capitalize(string) {
  if (string !== undefined) {
    let capitalizedString;
    if (string.includes(`"`)) {
      string = string.replaceAll(`"`, "");
    }
    capitalizedString =
      string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    if (string.includes(`-`)) {
      let hyphenIndex = string.indexOf("-");
      let capitalizedLetter = capitalizedString
        .charAt(hyphenIndex + 1)
        .toUpperCase();
      let nameStart = capitalizedString.slice(0, hyphenIndex);
      let nameEnd = capitalizedString.slice(hyphenIndex + 2);
      capitalizedString = `${nameStart}-${capitalizedLetter}${nameEnd}`;
    }
    return capitalizedString;
  }
}

function cleanBlood(data) {
  bloodArray = data;
}

// Sorting and Filtering
function sortStudents() {
  buildList();
}

function sortList(sortedList) {
  // sortedList = sortedList.sort((a, b) => {
  //   return a.firstName - b.firstName;
  // });

  function sortByProperty(A, B) {
    if (A < B) {
      return -1;
    } else {
      return 1;
    }
  }

  return sortedList;
}

function filterStudents(event) {
  settings.filterBy = event.target.value;
  buildList();
}

function filterList(filteredList) {
  searchInput.value = "";
  if (settings.filterBy === "Gryffindor") {
    filteredList = studentArray.filter(isGryff);
  } else if (settings.filterBy === "Slytherin") {
    filteredList = studentArray.filter(isSlyth);
  } else if (settings.filterBy === "Ravenclaw") {
    filteredList = studentArray.filter(isRaven);
  } else if (settings.filterBy === "Hufflepuff") {
    filteredList = studentArray.filter(isHuffle);
  } else if (settings.filterBy === "Expelled") {
    filteredList = expelledStudents;
  }
  return filteredList;
}

function isGryff(studentArray) {
  return studentArray.house === "Gryffindor";
}
function isSlyth(studentArray) {
  return studentArray.house === "Slytherin";
}
function isRaven(studentArray) {
  return studentArray.house === "Ravenclaw";
}
function isHuffle(studentArray) {
  return studentArray.house === "Hufflepuff";
}

// SEARCHING

const searchInput = document.getElementById("searchBar");

// store name elements in array-like object
const namesFromDOM = document.getElementsByClassName("student-properties");

// listen for user events
searchInput.addEventListener("keyup", (event) => {
  //   const { value } = event.target;
  // get user search input converted to lowercase
  const searchQuery = event.target.value.toLowerCase();

  for (const nameElement of namesFromDOM) {
    // store name text and convert to lowercase
    let name = nameElement.textContent.toLowerCase();

    // compare current name to search input
    if (name.includes(searchQuery)) {
      // found name matching search, display it
      nameElement.parentNode.classList.remove("hide");
    } else {
      // no match, don't display name
      nameElement.parentNode.classList.add("hide");
    }
  }
});
