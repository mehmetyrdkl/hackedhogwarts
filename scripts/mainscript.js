"use strict";

const studentArray = [];

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

function init() {
  const urlStudentSetRawData =
    "https://petlatkea.dk/2021/hogwarts/students.json";
  const urlBloodRawData = "https://petlatkea.dk/2021/hogwarts/families.json";

  fetch(urlStudentSetRawData)
    .then((response) => response.json())
    .then((data) => handleStudentList(data));

  function handleStudentList(data) {
    data.forEach(cleaningData);
    studentArray.forEach(showStudentList);
  }

  // pop up click
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
  let firstName, lastName, middleName, nickName;
  // console.log(data);
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

  let image;

  if (lastName === undefined) {
    image = "/placeholder-image.png";
  } else {
    image = lastName.toLowerCase() + "_" + firstName[0].toLowerCase() + ".png";
  }

  // name array find first name
  // name array find middle name
  // check if middle name !== lastname
  // check if middle name doesnt contain quotation marks
  // name array find nickname
  // name array find last name
  // capitalize all of them
  // console.log(nameArray);
  // console.log(lastName);
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
