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

  constructor(gallerySelector: HTMLElement) {
    this.gallerySelector = gallerySelector;
    this.isInit = false;
    this.galleryImages = Array.from(
      this.gallerySelector.querySelectorAll(lightboxImageSelector)
    );
    this.currentImage = 0;
  }

  init() {
    if (!this.isInit) {
      this.isInit = true;
      for (let i = 0; i < this.galleryImages.length; i++) {
        this.galleryImages[i].addEventListener("click", (event: MouseEvent) => {
          const openImage = event.currentTarget as HTMLElement;
          this.currentImage = this.galleryImages.indexOf(openImage);
          this.addLightboxTemplate();
          this.reload();
        });
      }
    }
  }

  reload() {
    const lightboxImage = document.querySelector(
      ".lightbox-viewer-modal-js .lightbox-viewer-js .lightbox-image-js"
    ) as HTMLImageElement;
    const currentImg = this.galleryImages[this.currentImage];
    if (lightboxImage && currentImg.dataset && currentImg.dataset.src) {
      lightboxImage.src = currentImg.dataset.src;
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
        ".lightbox-viewer-js.lightbox-viewer-hide"
      );
      const lightboxCloserNode = document.querySelector(
        ".lightbox-closer-js.lightbox-closer-hide"
      );
      const lightboxCounterNode = document.querySelector(
        ".lightbox-counter-js.lightbox-counter-hide"
      );
      lightboxVieverNode?.classList.remove("lightbox-viewer-hide");
      lightboxCloserNode?.classList.remove("lightbox-closer-hide");
      lightboxCounterNode?.classList.remove("lightbox-counter-hide");
      clearTimeout(secondTimeoutId);
    }, 300);

    const lightboxCloserNodeElement = document.querySelector(
      ".lightbox-closer-js"
    ) as HTMLElement | null;
    lightboxCloserNodeElement?.addEventListener(
      "click",
      (event: MouseEvent) => {
        const lightboxCloserElement = event.currentTarget as HTMLElement;
        const lightboxModalElement = lightboxCloserElement.parentElement;
        const ligthboxViewerElement =
          lightboxModalElement?.querySelector(".lightbox-viewer");
        const ligthboxCounterElement =
          lightboxModalElement?.querySelector(".lightbox-counter");
        lightboxCloserElement?.classList.add("lightbox-closer-hide");
        ligthboxViewerElement?.classList.add("lightbox-viewer-hide");
        if (
          ligthboxCounterElement &&
          !ligthboxCounterElement.classList.contains("lightbox-counter-hide")
        ) {
          ligthboxCounterElement.classList.add("lightbox-counter-hide");
        }
        const closerTimeoutId = setTimeout(() => {
          lightboxModalElement?.parentElement?.removeChild(
            lightboxModalElement
          );
          clearTimeout(closerTimeoutId);
        }, 500);
      }
    );
  }
}

const nodeGalleryContainers: NodeListOf<HTMLElement> =
  document.querySelectorAll(lightboxContainerSelector);

const galleryContainers: LightboxGallery[] = [];

for (let i = 0; i < nodeGalleryContainers.length; i++) {
  galleryContainers.push(new LightboxGallery(nodeGalleryContainers[i]));
  galleryContainers[galleryContainers.length - 1].init();
}
