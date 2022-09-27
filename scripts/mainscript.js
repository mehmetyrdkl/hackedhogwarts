"use strict";

// creating the student object
const studentObject = {
  firstName: "",
  lastName: "",
  middleName: "",
  nickName: "",
  gender: "",
  picture: "",
  house: "",
  bloodStatus: "",
  expelled: false,
  prefect: false,
  inquisitor: false,
};

const urlStudentSet = "https://petlatkea.dk/2021/hogwarts/students.json";
const urlStudentBlood = "https://petlatkea.dk/2021/hogwarts/families.json";

fetch(urlStudentSet)
  .then((response) => response.json())
  .then((data) => handleStudentList(data));

function handleStudentList(data) {
  data.forEach(showStudentList);
}

function showStudentList(student) {
  const template = document.querySelector("#student-list-template").content;
  const parent = document.querySelector(".section-wrapper");
  const clone = template.cloneNode(true);
  clone.querySelector("#full-student-name").textContent = student.fullname;

  parent.appendChild(clone);

  console.log(student);
}

// pop up click
document.querySelector(".show-more-button").addEventListener("click", () => {
  document
    .querySelector(".student-details-pop-up")
    .classList.add("student-details-pop-up-visible");
});

document.querySelector(".pop-up-close").addEventListener("click", () => {
  document
    .querySelector(".student-details-pop-up")
    .classList.remove("student-details-pop-up-visible");
});
