const lightboxAllImages = document.querySelectorAll(".lightbox__gallery-image img");
const lightboxModal = document.querySelector(".lightbox__modal");
const lightboxImage = document.querySelector(".lightbox__modal-image");
const lightboxPrevBtn = document.getElementById("lightbox__modal-prev");
const lightboxNextBtn = document.getElementById("lightbox__modal-next");
const lightboxActualNumber = document.getElementById("lightbox__modal-number");
const lightboxAllNumber = document.getElementById("lightbox__modal-number-all");

const setAnotherImage = image => {
    lightboxImage.setAttribute("src", lightboxAllImages[image - 1].getAttribute("src"));
    lightboxActualNumber.innerText = `${image}`;
}

lightboxAllImages.forEach((image, index) => {
    image.addEventListener("click", () => {
       lightboxImage.setAttribute("src", image.getAttribute("src"));
       lightboxModal.style.display = "flex";
       lightboxActualNumber.innerText = `${index + 1}`;
       lightboxAllNumber.innerText = `${lightboxAllImages.length}`;
    });
});

lightboxModal.addEventListener("click", event => {
   if (event.target === lightboxModal) {
       lightboxModal.style.display = "none";
   }
});

lightboxPrevBtn.addEventListener("click", () => {
    let actualImage = parseInt(lightboxActualNumber.innerText);
    if (actualImage > 1) {
        actualImage--;
        setAnotherImage(actualImage);
    }
});

lightboxNextBtn.addEventListener("click", () => {
   let actualImage = parseInt(lightboxActualNumber.innerText);
   if (actualImage < lightboxAllImages.length) {
       actualImage++;
       setAnotherImage(actualImage);
   }
});