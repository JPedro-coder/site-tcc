document.addEventListener("DOMContentLoaded", () => {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const caption = document.getElementById("caption");
  const closeBtn = document.querySelector(".close");
  const nextBtn = document.querySelector(".next");
  const prevBtn = document.querySelector(".prev");
  const images = document.querySelectorAll(".galeria-img");

  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    const img = images[currentIndex];
    lightboxImg.src = img.dataset.full; // imagem grande
    lightboxImg.alt = img.alt;
    caption.textContent = img.alt;
    lightbox.removeAttribute("hidden");
    document.body.style.overflow = "hidden"; // impede rolagem
  }

  function closeLightbox() {
    lightbox.setAttribute("hidden", "");
    document.body.style.overflow = "";
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % images.length;
    openLightbox(currentIndex);
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    openLightbox(currentIndex);
  }

  images.forEach((img, index) => {
    img.addEventListener("click", () => openLightbox(index));
    img.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") openLightbox(index);
    });
  });

  closeBtn.addEventListener("click", closeLightbox);
  nextBtn.addEventListener("click", showNext);
  prevBtn.addEventListener("click", showPrev);
  lightbox.addEventListener("click", e => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", e => {
    if (lightbox.hasAttribute("hidden")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") showNext();
    if (e.key === "ArrowLeft") showPrev();
  });
});


