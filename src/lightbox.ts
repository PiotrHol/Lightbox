const lightboxContainerSelector = ".lightbox-container";
const lightboxImageSelector = ".lightbox-image";

interface Lightbox {
  init: () => void;
}

class LightboxGallery implements Lightbox {
  private gallerySelector;
  private isInit: boolean;
  private galleryImages: HTMLElement[];
  private currentImage: number;
  private touchCoordinatesX: number;

  constructor(gallerySelector: HTMLElement) {
    this.gallerySelector = gallerySelector;
    this.isInit = false;
    this.galleryImages = Array.from(
      this.gallerySelector.querySelectorAll(lightboxImageSelector)
    );
    this.currentImage = 0;
    this.touchCoordinatesX = 0;
  }

  init() {
    if (!this.isInit) {
      this.isInit = true;
      for (let i = 0; i < this.galleryImages.length; i++) {
        this.galleryImages[i].addEventListener("click", (event: MouseEvent) => {
          const openImage = event.currentTarget as HTMLElement;
          this.currentImage = this.galleryImages.indexOf(openImage);
          this.addLightboxTemplate();
          this.reload(true);
        });
      }
    }
  }

  reload(isFirstReload = false) {
    const lightboxImage = document.querySelector(
      ".lightbox-viewer-modal-js .lightbox-viewer-js .lightbox-image-js"
    ) as HTMLImageElement;
    const lightboxLoader = document.querySelector(
      ".lightbox-viewer-modal-js .lightbox-viewer-js .lightbox-loader-js"
    ) as HTMLDivElement;
    const lightboxCaption = document.querySelector(
      ".lightbox-viewer-modal-js .lightbox-viewer-js .lightbox-caption-js"
    ) as HTMLDivElement;
    const currentImg = this.galleryImages[this.currentImage];
    if (lightboxImage && currentImg.dataset && currentImg.dataset.src) {
      const prevLightboxImageWidth = lightboxImage.width;
      const prevLightboxImageHeight = lightboxImage.height;
      lightboxImage.style.width = "auto";
      lightboxImage.style.height = "auto";
      lightboxImage.classList.remove("lightbox-image--show");
      lightboxLoader.classList.remove("lightbox-hidden");
      let isPrevLightboxCaption = false;
      if (lightboxCaption.classList.contains("lightbox-caption--show")) {
        isPrevLightboxCaption = true;
        lightboxCaption.classList.remove("lightbox-caption--show");
      }
      lightboxImage.style.opacity = "0";
      lightboxImage.src = currentImg.dataset.src;
      let parentElementWidth: number | undefined;
      let parentElementHeight: number | undefined;
      let isLoadingComplete = lightboxImage.complete;
      if (isLoadingComplete) {
        parentElementWidth = lightboxImage.parentElement?.offsetWidth;
        parentElementHeight = lightboxImage.parentElement?.offsetHeight;
        if (!isFirstReload) {
          lightboxImage.style.width = `${prevLightboxImageWidth}px`;
          lightboxImage.style.height = `${prevLightboxImageHeight}px`;
        }
      }
      lightboxImage.onload = () => {
        if (!isLoadingComplete) {
          parentElementWidth = lightboxImage.parentElement?.offsetWidth;
          parentElementHeight = lightboxImage.parentElement?.offsetHeight;
          if (!isFirstReload) {
            lightboxImage.style.width = `${prevLightboxImageWidth}px`;
            lightboxImage.style.height = `${prevLightboxImageHeight}px`;
          }
        }
        const timeoutId = setTimeout(() => {
          lightboxImage.style.width = `${parentElementWidth}px`;
          lightboxImage.style.height = `${parentElementHeight}px`;
          clearTimeout(timeoutId);
        }, 100);
        const secondTimeoutId = setTimeout(() => {
          lightboxLoader.classList.add("lightbox-hidden");
          lightboxImage.classList.add("lightbox-image--show");
          lightboxImage.style.opacity = "1";
          lightboxImage.style.width = "auto";
          lightboxImage.style.height = "auto";
          if (currentImg.dataset.caption) {
            lightboxCaption.innerText =
              currentImg.dataset.caption.length > 100
                ? currentImg.dataset.caption.slice(0, 99) + "..."
                : currentImg.dataset.caption;
            if (isPrevLightboxCaption) {
              lightboxCaption.classList.add("lightbox-caption--show");
            }
          }
          clearTimeout(secondTimeoutId);
        }, 500);
      };
    }
    if (lightboxImage && currentImg.dataset && currentImg.dataset.alt) {
      lightboxImage.alt = currentImg.dataset.alt;
    }
    const lightboxCounter = document.querySelector(
      ".lightbox-viewer-modal-js .lightbox-counter-js"
    ) as HTMLElement;
    if (lightboxCounter) {
      lightboxCounter.innerText = `${this.currentImage + 1} / ${
        this.galleryImages.length
      }`;
    }
    const lightboxLeftArrow = document.querySelector(
      ".lightbox-viewer-modal-js .lightbox-viewer-js .lightbox-left-arrow-js"
    ) as HTMLElement;
    if (
      lightboxLeftArrow &&
      this.currentImage == 0 &&
      !lightboxLeftArrow.classList.contains("lightbox-hidden")
    ) {
      lightboxLeftArrow.classList.add("lightbox-hidden");
    } else if (
      lightboxLeftArrow &&
      lightboxLeftArrow.classList.contains("lightbox-hidden")
    ) {
      lightboxLeftArrow.classList.remove("lightbox-hidden");
    }
    const lightboxRightArrow = document.querySelector(
      ".lightbox-viewer-modal-js .lightbox-viewer-js .lightbox-right-arrow-js"
    ) as HTMLElement;
    if (
      lightboxRightArrow &&
      this.currentImage == this.galleryImages.length - 1 &&
      !lightboxRightArrow.classList.contains("lightbox-hidden")
    ) {
      lightboxRightArrow.classList.add("lightbox-hidden");
    } else if (
      lightboxRightArrow &&
      lightboxRightArrow.classList.contains("lightbox-hidden")
    ) {
      lightboxRightArrow.classList.remove("lightbox-hidden");
    }
  }

  addLightboxTemplate() {
    const lightboxTemplate = document.createElement("div");
    lightboxTemplate.classList.add(
      "lightbox-viewer-modal",
      "lightbox-viewer-modal-js",
      "lightbox-viewer-modal-hide"
    );
    const lightboxCloser = document.createElement("div");
    lightboxCloser.classList.add(
      "lightbox-closer",
      "lightbox-closer-js",
      "lightbox-closer-hide"
    );
    lightboxTemplate.appendChild(lightboxCloser);
    const lightboxViewer = document.createElement("div");
    lightboxViewer.classList.add(
      "lightbox-viewer",
      "lightbox-viewer-js",
      "lightbox-viewer-hide"
    );
    const lightboxLoader = document.createElement("div");
    lightboxLoader.classList.add("lightbox-loader", "lightbox-loader-js");
    lightboxViewer.appendChild(lightboxLoader);
    const lightboxImage = document.createElement("img");
    lightboxImage.classList.add("lightbox-image", "lightbox-image-js");
    lightboxImage.src = "";
    lightboxImage.alt = "";
    lightboxViewer.appendChild(lightboxImage);
    if (this.galleryImages.length > 1) {
      const lightboxCounter = document.createElement("div");
      lightboxCounter.classList.add(
        "lightbox-counter",
        "lightbox-counter-js",
        "lightbox-counter-hide"
      );
      lightboxTemplate.appendChild(lightboxCounter);
      const lightboxLeftArrow = document.createElement("div");
      lightboxLeftArrow.classList.add(
        "lightbox-left-arrow",
        "lightbox-left-arrow-js"
      );
      lightboxViewer.appendChild(lightboxLeftArrow);
      const lightboxRightArrow = document.createElement("div");
      lightboxRightArrow.classList.add(
        "lightbox-right-arrow",
        "lightbox-right-arrow-js"
      );
      lightboxViewer.appendChild(lightboxRightArrow);
    }
    const lightboxImageCaption = document.createElement("div");
    lightboxImageCaption.classList.add(
      "lightbox-caption",
      "lightbox-caption-js"
    );
    lightboxViewer.appendChild(lightboxImageCaption);
    lightboxTemplate.appendChild(lightboxViewer);
    document.body.appendChild(lightboxTemplate);
    const firstTimeoutId = setTimeout(() => {
      const lightboxModalNode = document.querySelector(
        ".lightbox-viewer-modal-js.lightbox-viewer-modal-hide"
      );
      lightboxModalNode?.classList.remove("lightbox-viewer-modal-hide");
      clearTimeout(firstTimeoutId);
    }, 100);

    const secondTimeoutId = setTimeout(() => {
      const lightboxVieverNode = document.querySelector(
        ".lightbox-viewer-modal-js .lightbox-viewer-js.lightbox-viewer-hide"
      );
      const lightboxCloserNode = document.querySelector(
        ".lightbox-viewer-modal-js .lightbox-closer-js.lightbox-closer-hide"
      );
      const lightboxCounterNode = document.querySelector(
        ".lightbox-viewer-modal-js .lightbox-counter-js.lightbox-counter-hide"
      );
      lightboxVieverNode?.classList.remove("lightbox-viewer-hide");
      lightboxCloserNode?.classList.remove("lightbox-closer-hide");
      lightboxCounterNode?.classList.remove("lightbox-counter-hide");
      clearTimeout(secondTimeoutId);
    }, 300);

    const lightboxCloserNodeElement = document.querySelector(
      ".lightbox-viewer-modal-js .lightbox-closer-js"
    ) as HTMLElement;
    if (lightboxCloserNodeElement) {
      lightboxCloserNodeElement.addEventListener("click", () => {
        this.closeLightboxHandler();
      });
    }

    const lightboxLeftArrowNodeElement = document.querySelector(
      ".lightbox-viewer-modal-js .lightbox-viewer-js .lightbox-left-arrow-js"
    ) as HTMLElement;
    if (lightboxLeftArrowNodeElement) {
      lightboxLeftArrowNodeElement.addEventListener("click", () => {
        if (window.innerWidth > 768) {
          this.changeCurrentImage("prev");
        }
      });
    }

    const lightboxRightArrowNodeElement = document.querySelector(
      ".lightbox-viewer-modal-js .lightbox-viewer-js .lightbox-right-arrow-js"
    ) as HTMLElement;
    if (lightboxRightArrowNodeElement) {
      lightboxRightArrowNodeElement.addEventListener("click", () => {
        if (window.innerWidth > 768) {
          this.changeCurrentImage("next");
        }
      });
    }

    document.addEventListener("keydown", this.keyEventHandler);

    const lightboxViewerNodeElement = document.querySelector(
      ".lightbox-viewer-modal-js .lightbox-viewer-js"
    ) as HTMLElement;
    lightboxViewerNodeElement.addEventListener(
      "touchstart",
      this.touchStartEventHandler
    );
    lightboxViewerNodeElement.addEventListener(
      "touchend",
      this.touchEndEventHandler
    );

    const lightboxImageNodeElement = document.querySelector(
      ".lightbox-viewer-modal-js .lightbox-viewer-js .lightbox-image-js"
    ) as HTMLImageElement;
    lightboxImageNodeElement.addEventListener("click", (e: MouseEvent) => {
      if (e.currentTarget == e.target && window.innerWidth < 769) {
        const imageNodeElement = e.currentTarget as HTMLImageElement;
        const captionNodeElement =
          imageNodeElement.parentElement?.querySelector(".lightbox-caption-js");
        if (captionNodeElement) {
          if (captionNodeElement.classList.contains("lightbox-caption--show")) {
            captionNodeElement.classList.remove("lightbox-caption--show");
          } else {
            captionNodeElement.classList.add("lightbox-caption--show");
          }
        }
      }
    });
    lightboxImageNodeElement.addEventListener("mouseenter", (e: MouseEvent) => {
      const imageNodeElement = e.currentTarget as HTMLImageElement;
      const captionNodeElement = imageNodeElement.parentElement?.querySelector(
        ".lightbox-caption-js"
      );
      if (
        window.innerWidth > 768 &&
        captionNodeElement &&
        !captionNodeElement.classList.contains("lightbox-caption--show")
      ) {
        captionNodeElement.classList.add("lightbox-caption--show");
      }
    });
    lightboxImageNodeElement.addEventListener("mouseleave", (e: MouseEvent) => {
      const imageNodeElement = e.currentTarget as HTMLImageElement;
      const captionNodeElement = imageNodeElement.parentElement?.querySelector(
        ".lightbox-caption-js"
      );
      if (
        window.innerWidth > 768 &&
        captionNodeElement &&
        captionNodeElement.classList.contains("lightbox-caption--show")
      ) {
        captionNodeElement.classList.remove("lightbox-caption--show");
      }
    });
  }

  changeCurrentImage(sequence: "prev" | "next") {
    if (sequence === "prev" && this.currentImage > 0) {
      this.currentImage = this.currentImage - 1;
      this.reload();
    } else if (
      sequence === "next" &&
      this.currentImage < this.galleryImages.length - 1
    ) {
      this.currentImage = this.currentImage + 1;
      this.reload();
    }
  }

  closeLightboxHandler = () => {
    const lightboxCloserElement = document.querySelector(
      ".lightbox-viewer-modal-js .lightbox-closer-js"
    ) as HTMLElement;
    if (lightboxCloserElement) {
      const lightboxModalElement = lightboxCloserElement.parentElement;
      const ligthboxViewerElement = lightboxModalElement?.querySelector(
        ".lightbox-viewer-js"
      ) as HTMLElement;
      const ligthboxCounterElement = lightboxModalElement?.querySelector(
        ".lightbox-counter-js"
      );
      const lightboxImageElement = ligthboxViewerElement?.querySelector(
        ".lightbox-image-js"
      ) as HTMLImageElement;
      lightboxCloserElement.classList.add("lightbox-closer-hide");
      ligthboxViewerElement?.classList.add("lightbox-viewer-hide");
      if (lightboxImageElement) {
        lightboxImageElement.style.opacity = "0";
      }
      if (
        ligthboxCounterElement &&
        !ligthboxCounterElement.classList.contains("lightbox-counter-hide")
      ) {
        ligthboxCounterElement.classList.add("lightbox-counter-hide");
      }
      document.removeEventListener("keydown", this.keyEventHandler);
      ligthboxViewerElement.removeEventListener(
        "touchstart",
        this.touchStartEventHandler
      );
      ligthboxViewerElement.removeEventListener(
        "touchend",
        this.touchEndEventHandler
      );
      const closerTimeoutId = setTimeout(() => {
        lightboxModalElement?.parentElement?.removeChild(lightboxModalElement);
        clearTimeout(closerTimeoutId);
      }, 700);
    }
  };

  keyEventHandler = (event: KeyboardEvent) => {
    if (event.key === "ArrowLeft") {
      this.changeCurrentImage("prev");
    } else if (event.key === "ArrowRight") {
      this.changeCurrentImage("next");
    } else if (event.key === "Escape") {
      this.closeLightboxHandler();
    }
  };

  touchStartEventHandler = (event: TouchEvent) => {
    this.touchCoordinatesX = event.changedTouches[0].clientX;
  };

  touchEndEventHandler = (event: TouchEvent) => {
    const touchEndCoordinatesX = event.changedTouches[0].clientX;
    if (touchEndCoordinatesX > this.touchCoordinatesX + 30) {
      this.changeCurrentImage("prev");
    } else if (touchEndCoordinatesX + 30 < this.touchCoordinatesX) {
      this.changeCurrentImage("next");
    }
  };
}

const nodeGalleryContainers: NodeListOf<HTMLElement> =
  document.querySelectorAll(lightboxContainerSelector);

const galleryContainers: LightboxGallery[] = [];

for (let i = 0; i < nodeGalleryContainers.length; i++) {
  galleryContainers.push(new LightboxGallery(nodeGalleryContainers[i]));
  galleryContainers[galleryContainers.length - 1].init();
}
