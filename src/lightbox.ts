const lightboxHiddenClass = "lightbox-hidden";
const lightboxContainerClass = "lightbox-container";
const lightboxImagesClass = "lightbox-image";
const lightboxModalClass = "lightbox-viewer-modal";
const lightboxViewerClass = "lightbox-viewer";
const lightboxViewerImageClass = "lightbox-viewer-image";
const lightboxLoaderClass = "lightbox-loader";
const lightboxCaptionClass = "lightbox-caption";
const lightboxCounterClass = "lightbox-counter";
const lightboxLeftArrowClass = "lightbox-left-arrow";
const lightboxRightArrowClass = "lightbox-right-arrow";
const lightboxCloserClass = "lightbox-closer";
const lightboxStopScrollClass = "lightbox-stop-scroll";

interface Lightbox {
  init: () => void;
  reload: (a: boolean) => void;
  addLightboxTemplate: () => void;
  changeCurrentImage: (a: "prev" | "next") => void;
  closeLightboxHandler: () => void;
  keyEventHandler: (e: KeyboardEvent) => void;
  touchStartEventHandler: (e: TouchEvent) => void;
  touchEndEventHandler: (e: TouchEvent) => void;
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
      this.gallerySelector.querySelectorAll(`.${lightboxImagesClass}`)
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
      `.${lightboxModalClass}-js .${lightboxViewerClass}-js .${lightboxViewerImageClass}-js`
    ) as HTMLImageElement;
    const lightboxLoader = document.querySelector(
      `.${lightboxModalClass}-js .${lightboxViewerClass}-js .${lightboxLoaderClass}-js`
    ) as HTMLDivElement;
    const lightboxCaption = document.querySelector(
      `.${lightboxModalClass}-js .${lightboxViewerClass}-js .${lightboxCaptionClass}-js`
    ) as HTMLDivElement;
    const currentImg = this.galleryImages[this.currentImage];
    if (lightboxImage && currentImg.dataset && currentImg.dataset.src) {
      const prevLightboxImageWidth = lightboxImage.width;
      const prevLightboxImageHeight = lightboxImage.height;
      lightboxImage.style.width = "auto";
      lightboxImage.style.height = "auto";
      lightboxImage.classList.remove(`${lightboxViewerImageClass}--show`);
      lightboxLoader.classList.remove(lightboxHiddenClass);
      let isPrevLightboxCaption = false;
      if (lightboxCaption.classList.contains(`${lightboxCaptionClass}--show`)) {
        isPrevLightboxCaption = true;
        lightboxCaption.classList.remove(`${lightboxCaptionClass}--show`);
      }
      lightboxCaption.innerText = "";
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
          if (currentImg.dataset.caption) {
            lightboxCaption.innerText =
              currentImg.dataset.caption.length > 100
                ? currentImg.dataset.caption.slice(0, 99) + "..."
                : currentImg.dataset.caption;
            if (isPrevLightboxCaption) {
              lightboxCaption.classList.add(`${lightboxCaptionClass}--show`);
            }
          } else {
            if (
              lightboxCaption.classList.contains(
                `${lightboxCaptionClass}--show`
              )
            ) {
              lightboxCaption.classList.remove(`${lightboxCaptionClass}--show`);
            }
          }
          lightboxLoader.classList.add(lightboxHiddenClass);
          lightboxImage.classList.add(`${lightboxViewerImageClass}--show`);
          lightboxImage.style.opacity = "1";
          lightboxImage.style.width = "auto";
          lightboxImage.style.height = "auto";
          clearTimeout(secondTimeoutId);
        }, 500);
      };
    } else {
      lightboxImage.src = "";
      lightboxCaption.innerText = "";
    }
    if (
      lightboxImage &&
      currentImg.dataset &&
      currentImg.dataset.src &&
      currentImg.dataset.alt
    ) {
      lightboxImage.alt = currentImg.dataset.alt;
    } else {
      lightboxImage.alt = "";
    }
    const lightboxCounter = document.querySelector(
      `.${lightboxModalClass}-js .${lightboxCounterClass}-js`
    ) as HTMLElement;
    if (lightboxCounter) {
      lightboxCounter.innerText = `${this.currentImage + 1} / ${
        this.galleryImages.length
      }`;
    }
    const lightboxLeftArrow = document.querySelector(
      `.${lightboxModalClass}-js .${lightboxViewerClass}-js .${lightboxLeftArrowClass}-js`
    ) as HTMLElement;
    if (
      lightboxLeftArrow &&
      this.currentImage == 0 &&
      !lightboxLeftArrow.classList.contains(lightboxHiddenClass)
    ) {
      lightboxLeftArrow.classList.add(lightboxHiddenClass);
    } else if (
      lightboxLeftArrow &&
      lightboxLeftArrow.classList.contains(lightboxHiddenClass)
    ) {
      lightboxLeftArrow.classList.remove(lightboxHiddenClass);
    }
    const lightboxRightArrow = document.querySelector(
      `.${lightboxModalClass}-js .${lightboxViewerClass}-js .${lightboxRightArrowClass}-js`
    ) as HTMLElement;
    if (
      lightboxRightArrow &&
      this.currentImage == this.galleryImages.length - 1 &&
      !lightboxRightArrow.classList.contains(lightboxHiddenClass)
    ) {
      lightboxRightArrow.classList.add(lightboxHiddenClass);
    } else if (
      lightboxRightArrow &&
      lightboxRightArrow.classList.contains(lightboxHiddenClass)
    ) {
      lightboxRightArrow.classList.remove(lightboxHiddenClass);
    }
  }

  addLightboxTemplate() {
    const lightboxTemplate = document.createElement("div");
    lightboxTemplate.classList.add(
      lightboxModalClass,
      `${lightboxModalClass}-js`,
      `${lightboxModalClass}-hide`
    );
    const lightboxCloser = document.createElement("div");
    lightboxCloser.classList.add(
      lightboxCloserClass,
      `${lightboxCloserClass}-js`,
      `${lightboxCloserClass}-hide`
    );
    lightboxTemplate.appendChild(lightboxCloser);
    const lightboxViewer = document.createElement("div");
    lightboxViewer.classList.add(
      lightboxViewerClass,
      `${lightboxViewerClass}-js`,
      `${lightboxViewerClass}-hide`
    );
    const lightboxLoader = document.createElement("div");
    lightboxLoader.classList.add(
      lightboxLoaderClass,
      `${lightboxLoaderClass}-js`
    );
    lightboxViewer.appendChild(lightboxLoader);
    const lightboxImage = document.createElement("img");
    lightboxImage.classList.add(
      lightboxViewerImageClass,
      `${lightboxViewerImageClass}-js`
    );
    lightboxImage.src = "";
    lightboxImage.alt = "";
    lightboxViewer.appendChild(lightboxImage);
    if (this.galleryImages.length > 1) {
      const lightboxCounter = document.createElement("div");
      lightboxCounter.classList.add(
        lightboxCounterClass,
        `${lightboxCounterClass}-js`,
        `${lightboxCounterClass}-hide`
      );
      lightboxTemplate.appendChild(lightboxCounter);
      const lightboxLeftArrow = document.createElement("div");
      lightboxLeftArrow.classList.add(
        lightboxLeftArrowClass,
        `${lightboxLeftArrowClass}-js`
      );
      lightboxViewer.appendChild(lightboxLeftArrow);
      const lightboxRightArrow = document.createElement("div");
      lightboxRightArrow.classList.add(
        lightboxRightArrowClass,
        `${lightboxRightArrowClass}-js`
      );
      lightboxViewer.appendChild(lightboxRightArrow);
    }
    const lightboxImageCaption = document.createElement("div");
    lightboxImageCaption.classList.add(
      lightboxCaptionClass,
      `${lightboxCaptionClass}-js`
    );
    lightboxViewer.appendChild(lightboxImageCaption);
    lightboxTemplate.appendChild(lightboxViewer);
    document.body.classList.add(lightboxStopScrollClass);
    document.body.appendChild(lightboxTemplate);
    const firstTimeoutId = setTimeout(() => {
      const lightboxModalNode = document.querySelector(
        `.${lightboxModalClass}-js.${lightboxModalClass}-hide`
      );
      lightboxModalNode?.classList.remove(`${lightboxModalClass}-hide`);
      clearTimeout(firstTimeoutId);
    }, 100);

    const secondTimeoutId = setTimeout(() => {
      const lightboxVieverNode = document.querySelector(
        `.${lightboxModalClass}-js .${lightboxViewerClass}-js.${lightboxViewerClass}-hide`
      );
      const lightboxCloserNode = document.querySelector(
        `.${lightboxModalClass}-js .${lightboxCloserClass}-js.${lightboxCloserClass}-hide`
      );
      const lightboxCounterNode = document.querySelector(
        `.${lightboxModalClass}-js .${lightboxCounterClass}-js.${lightboxCounterClass}-hide`
      );
      lightboxVieverNode?.classList.remove(`${lightboxViewerClass}-hide`);
      lightboxCloserNode?.classList.remove(`${lightboxCloserClass}-hide`);
      lightboxCounterNode?.classList.remove(`${lightboxCounterClass}-hide`);
      clearTimeout(secondTimeoutId);
    }, 300);

    const lightboxCloserNodeElement = document.querySelector(
      `.${lightboxModalClass}-js .${lightboxCloserClass}-js`
    ) as HTMLElement | null;
    if (lightboxCloserNodeElement) {
      lightboxCloserNodeElement.addEventListener("click", () => {
        this.closeLightboxHandler();
      });
    }

    const lightboxModalNodeElement = document.querySelector(
      `.${lightboxModalClass}-js`
    ) as HTMLElement | null;
    if (lightboxModalNodeElement) {
      lightboxModalNodeElement.addEventListener("click", (e: MouseEvent) => {
        if (e.currentTarget == e.target) {
          this.closeLightboxHandler();
        }
      });
    }

    const lightboxLeftArrowNodeElement = document.querySelector(
      `.${lightboxModalClass}-js .${lightboxViewerClass}-js .${lightboxLeftArrowClass}-js`
    ) as HTMLElement;
    if (lightboxLeftArrowNodeElement) {
      lightboxLeftArrowNodeElement.addEventListener("click", () => {
        if (window.innerWidth > 768) {
          this.changeCurrentImage("prev");
        }
      });
    }

    const lightboxRightArrowNodeElement = document.querySelector(
      `.${lightboxModalClass}-js .${lightboxViewerClass}-js .${lightboxRightArrowClass}-js`
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
      `.${lightboxModalClass}-js .${lightboxViewerClass}-js`
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
      `.${lightboxModalClass}-js .${lightboxViewerClass}-js .${lightboxViewerImageClass}-js`
    ) as HTMLImageElement;
    lightboxImageNodeElement.addEventListener("click", (e: MouseEvent) => {
      if (e.currentTarget == e.target && window.innerWidth < 769) {
        const imageNodeElement = e.currentTarget as HTMLImageElement;
        const captionNodeElement =
          imageNodeElement.parentElement?.querySelector(
            `.${lightboxCaptionClass}-js`
          ) as HTMLDivElement | null | undefined;
        if (captionNodeElement && !!captionNodeElement.innerText) {
          if (
            captionNodeElement.classList.contains(
              `${lightboxCaptionClass}--show`
            )
          ) {
            captionNodeElement.classList.remove(
              `${lightboxCaptionClass}--show`
            );
          } else {
            captionNodeElement.classList.add(`${lightboxCaptionClass}--show`);
          }
        }
      }
    });
    lightboxImageNodeElement.addEventListener("mousemove", (e: MouseEvent) => {
      const imageNodeElement = e.currentTarget as HTMLImageElement;
      const captionNodeElement = imageNodeElement.parentElement?.querySelector(
        `.${lightboxCaptionClass}-js`
      ) as HTMLDivElement | null | undefined;
      if (
        window.innerWidth > 768 &&
        captionNodeElement &&
        !!captionNodeElement.innerText &&
        !captionNodeElement.classList.contains(`${lightboxCaptionClass}--show`)
      ) {
        captionNodeElement.classList.add(`${lightboxCaptionClass}--show`);
      }
    });
    lightboxImageNodeElement.addEventListener("mouseleave", (e: MouseEvent) => {
      const imageNodeElement = e.currentTarget as HTMLImageElement;
      const captionNodeElement = imageNodeElement.parentElement?.querySelector(
        `.${lightboxCaptionClass}-js`
      );
      if (
        window.innerWidth > 768 &&
        captionNodeElement &&
        captionNodeElement.classList.contains(`${lightboxCaptionClass}--show`)
      ) {
        captionNodeElement.classList.remove(`${lightboxCaptionClass}--show`);
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
      `.${lightboxModalClass}-js .${lightboxCloserClass}-js`
    ) as HTMLElement;
    if (lightboxCloserElement) {
      const lightboxModalElement = lightboxCloserElement.parentElement;
      const ligthboxViewerElement = lightboxModalElement?.querySelector(
        `.${lightboxViewerClass}-js`
      ) as HTMLElement;
      const ligthboxCounterElement = lightboxModalElement?.querySelector(
        `.${lightboxCounterClass}-js`
      );
      const lightboxImageElement = ligthboxViewerElement?.querySelector(
        `.${lightboxViewerImageClass}-js`
      ) as HTMLImageElement;
      lightboxCloserElement.classList.add(`${lightboxCloserClass}-hide`);
      ligthboxViewerElement?.classList.add(`${lightboxViewerClass}-hide`);
      if (lightboxImageElement) {
        lightboxImageElement.style.opacity = "0";
      }
      if (
        ligthboxCounterElement &&
        !ligthboxCounterElement.classList.contains(
          `${lightboxCounterClass}-hide`
        )
      ) {
        ligthboxCounterElement.classList.add(`${lightboxCounterClass}-hide`);
      }
      document.removeEventListener("keydown", this.keyEventHandler);
      const closerTimeoutId = setTimeout(() => {
        lightboxModalElement?.parentElement?.removeChild(lightboxModalElement);
        document.body.classList.remove(lightboxStopScrollClass);
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
  document.querySelectorAll(`.${lightboxContainerClass}`);

const galleryContainers: LightboxGallery[] = [];

for (let i = 0; i < nodeGalleryContainers.length; i++) {
  galleryContainers.push(new LightboxGallery(nodeGalleryContainers[i]));
  galleryContainers[galleryContainers.length - 1].init();
}
