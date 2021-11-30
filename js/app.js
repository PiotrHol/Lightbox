const lightboxAllImages = document.querySelectorAll(".lightbox--gallery__image img");
const lightboxModal = document.querySelector(".lightbox--modal");
const lightboxImage = document.querySelector(".lightbox--modal__image");
const lightboxPrevBtn = document.getElementById("lightbox--modal__prev");
const lightboxNextBtn = document.getElementById("lightbox--modal__next");
const lightboxActualNumber = document.getElementById("lightbox--modal__number");
const lightboxAllNumber = document.getElementById("lightbox--modal__numberALl");

const setAnotherImage = image => {
    lightboxImage.setAttribute("src", lightboxAllImages[image - 1].getAttribute("src"));
    lightboxActualNumber.innerText = `${image}`;
}

lightboxAllImages.forEach((image, index) => {
    image.addEventListener("click", () => {
       lightboxImage.setAttribute("src", image.getAttribute("src"));
       lightboxModal.style.display = "flex";
       lightboxActualNumber.innerText = `${index + 1}`;
       lightboxAllNumber.innerText = `${lightboxAllImages.length - 1}`;
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
   if (actualImage < lightboxAllImages.length - 1) {
       actualImage++;
       setAnotherImage(actualImage);
   }
});