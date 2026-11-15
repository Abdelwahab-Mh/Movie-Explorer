let menuBtn = document.querySelector(".menuBtn");
let sections = document.querySelector(".sections");

menuBtn.onclick = function() {
    console.log("Done")
    sections.classList.toggle("active");
};