"use strict";

const urlStudentSet = "https://petlatkea.dk/2021/hogwarts/students.json";

fetch(urlStudentSet)
  .then((res) => res.json())
  .then((data) => handleStudentList(data));

function handleStudentList(data) {
  data.forEach(showStudentList);
}

function showStudentList(student) {
  const template = document.querySelector("#list-template").content;
  const parent = document.querySelector(".section-wrapper");
  const clone = template.cloneNode(true);
  clone.querySelector("#student-first-name").textContent = student.fullname;
  clone.querySelector("#student-gender").textContent = student.gender;
  clone.querySelector("#student-house").textContent = student.house;
  parent.appendChild(clone);

  console.log(student);
}
