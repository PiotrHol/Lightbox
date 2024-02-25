const lightboxContainerSelector = ".lightbox-container";

interface Lightbox {
  init: () => void;
}

class LightboxGallery implements Lightbox {
  private gallerySelector;
  private isInit;

  constructor(gallerySelector: HTMLElement) {
    this.gallerySelector = gallerySelector;
    this.isInit = false;
  }

  init() {
    if (!this.isInit) {
      this.isInit = true;
      console.log("Init gallery");
    }
  }
}

const nodeGalleryContainers: NodeListOf<HTMLElement> =
  document.querySelectorAll(lightboxContainerSelector);

const galleryContainers: LightboxGallery[] = [];

for (let i = 0; i < nodeGalleryContainers.length; i++) {
  galleryContainers.push(new LightboxGallery(nodeGalleryContainers[i]));
  galleryContainers[galleryContainers.length - 1].init();
}
