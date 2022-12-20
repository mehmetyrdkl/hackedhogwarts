"use strict";

let studentArray = [];
let bloodArray = [];
let expelledStudents = [];
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
  const currentList = filterList(studentArray);
  const sortedList = sortList(currentList);
  displayList(sortedList);
  showCount();
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

  if (student.expelled) {
    clone.querySelector(
      ".student-properties"
    ).textContent = `${student.firstName}  ${student.lastName} `;
    clone
      .querySelector(".expelled-list-template")
      .classList.add("expelled-list-template-visible");
  } else {
    clone.querySelector(
      ".student-properties"
    ).textContent = `${student.firstName}  ${student.lastName} `;
  }
  // PREF

  if (student.prefect) {
    clone
      .querySelector(".prefect-list-template")
      .classList.add("prefect-list-template-visible");
  } else if (student.prefect === false) {
    clone
      .querySelector(".prefect-list-template")
      .classList.remove("prefect-list-template-visible");
  }

  // INQ

  if (student.inquisitor) {
    clone
      .querySelector(".inquisitor-list-template")
      .classList.add("inquisitor-list-template-visible");
  } else if (student.inquisitor === false) {
    // console.log(student.inquisitor);
    clone
      .querySelector(".inquisitor-list-template")
      .classList.remove("inquisitor-list-template-visible");
  }

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
    document
      .querySelector(".expellStudent")
      .addEventListener("click", clickExpell);

    document.querySelector(".setInq").addEventListener("click", clickInquis);
    document.querySelector(".setPref").addEventListener("click", clickPrefect);

    function clickInquis() {
      if (student.inquisitor === true) {
        student.inquisitor = false;
      } else {
        student.inquisitor = makeInquis(student);
      }
      buildList();
    }

    function clickPrefect() {
      if (student.prefect === true) {
        student.prefect = false;
      } else {
        makePrefect(student);
      }

      buildList();
    }
  });

  // Expelling student

  function clickExpell() {
    if (student.expelled === false) {
      student.expelled = true;

      expellStudent(student);
    }

    buildList();
  }

  function expellStudent(selectedStudent) {
    expelledStudents.push(selectedStudent);
    studentArray = studentArray.filter((student) => student.expelled === false);
  }

  function makeInquis(selectedStudent) {
    if (selectedStudent.house === "Slytherin") {
      return true;
    } else if (selectedStudent.bloodStatus === "pure") {
      return true;
    } else {
      alert("This student is not a pureblood Slytherin");
      return false;
    }
  }

  function makePrefect(selectedStudent) {
    const prefectMembers = studentArray.filter((student) => student.prefect);
    // console.log("prefectMembers", prefectMembers);
    const prefectsOfHouse = prefectMembers.filter(
      (student) => student.house === selectedStudent.house
    );
    // console.log("prefectsOfHouse", prefectsOfHouse);

    if (prefectsOfHouse.length < 2) {
      // console.log(`number of prefects is: ${prefectsOfHouse.length}`);
      selectedStudent.prefect = true;
    } else {
      // console.log("too many prefects")
      alert("You have too many prefects per house");

      // removeAorB(prefectsOfHouse[0], prefectsOfHouse[1]);
      // selectedStudent.prefect = false;
    }
  }

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
    lastName = "";
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
function sortStudents(event) {
  settings.sortBy = event.target.value;
  buildList();
}

function sortList(sortedList) {
  searchInput.value = "";
  // console.log(studentArray);
  if (settings.sortBy === "firstName-ascending") {
    sortedList.sort(function (a, b) {
      return a.firstName.localeCompare(b.firstName);
    });
  } else if (settings.sortBy === "firstName-descending") {
    sortedList.sort(function (a, b) {
      return b.firstName.localeCompare(a.firstName);
    });
  } else if (settings.sortBy === "lastName-ascending") {
    sortedList.sort(function (a, b) {
      return a.lastName.localeCompare(b.lastName);
    });
  } else if (settings.sortBy === "lastName-descending") {
    sortedList.sort(function (a, b) {
      return b.lastName.localeCompare(a.lastName);
    });
  } else if (settings.sortBy === "house-ascending") {
    sortedList.sort(function (a, b) {
      return a.house.localeCompare(b.house);
    });
  } else if (settings.sortBy === "house-descending") {
    sortedList.sort(function (a, b) {
      return b.house.localeCompare(a.house);
    });
  } else if (settings.sortBy === "default") {
    return studentArray;
  }

  return sortedList;
}

function filterStudents(event) {
  settings.filterBy = event.target.value;
  buildList();
}

function filterList(filteredList) {
  settings.currentCount = studentArray.filter(
    (obj) => obj.house === settings.filterBy
  ).length;
  document.querySelector(
    "#current-students-displaying"
  ).textContent = `Currently displaying: ${settings.currentCount}`;

  searchInput.value = "";
  if (settings.filterBy === "Gryffindor") {
    filteredList = studentArray.filter(isGryff);
  } else if (settings.filterBy === "Slytherin") {
    filteredList = studentArray.filter(isSlyth);
  } else if (settings.filterBy === "Ravenclaw") {
    filteredList = studentArray.filter(isRaven);
  } else if (settings.filterBy === "Hufflepuff") {
    filteredList = studentArray.filter(isHuffle);
  } else if (settings.filterBy === "expelledStudents") {
    filteredList = expelledStudents;
  } else {
    filteredList = studentArray;
    settings.currentCount = studentArray.length;
    document.querySelector(
      "#current-students-displaying"
    ).textContent = `Currently displaying: ${studentArray.length}`;
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

  if (document.querySelector("#searchBar").value === "") {
    document.querySelector(
      "#current-students-displaying"
    ).textContent = `Currently displaying: ${settings.currentCount} students`;
  }
  // Student count

  let count = 0;

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

      if (nameElement.parentNode.classList.contains("hide")) {
        count++;
        document.querySelector(
          "#current-students-displaying"
        ).textContent = `Currently displaying: ${
          settings.currentCount - count
        } students`;
      }
    }
  }
});

function showCount() {
  const gryffindorStudents = studentArray.filter(
    (obj) => obj.house === "Gryffindor"
  ).length;
  document.querySelector(
    "#gryffindor-students-number"
  ).textContent = `House Gryffindor Students:${gryffindorStudents}`;

  const slytherinStudents = studentArray.filter(
    (obj) => obj.house === "Slytherin"
  ).length;
  document.querySelector(
    "#slytherin-students-number"
  ).textContent = `House Slytherin Students: ${slytherinStudents}`;

  const ravenclawStudents = studentArray.filter(
    (obj) => obj.house === "Ravenclaw"
  ).length;
  document.querySelector(
    "#ravenclaw-students-number"
  ).textContent = `House Ravenclaw Students: ${ravenclawStudents}`;

  const hufflepuffStudents = studentArray.filter(
    (obj) => obj.house === "Hufflepuff"
  ).length;
  document.querySelector(
    "#hufflepuff-students-number"
  ).textContent = `House Hufflepuff Students: ${hufflepuffStudents}`;

  document.querySelector(
    "#total-students-number"
  ).textContent = `Total Students displayed: ${studentArray.length}`;

  document.querySelector(
    "#total-expelled-students"
  ).textContent = `Expelled students ${expelledStudents.length}`;

  document.querySelector(
    "#total-active-students"
  ).textContent = `Active students: ${34 - expelledStudents.length}`;
}
