# Lightbox

Lightbox is a minimalist library that allows you to quickly add an interactive image gallery to your website. You can easily integrate it into an existing project to give your images a new dimension.

## Demo

<a href="https://piotrhol.github.io/Lightbox/" target="_blank">https://piotrhol.github.io/Lightbox/</a>

## Installation

To install Lightbox, follow these steps:

1. Go to the releases section in this repository.
2. Download the latest release of Lightbox.
3. Unzip the downloaded archive.
4. Include the **lightbox.min.js** and **lightbox.min.css** files in your project.

## Usage

After adding the library to your project, follow these steps:

1. Add the **"lightbox-container"** class to the parent element containing the images that will open the gallery.
2. Add the **"lightbox-image"** class to the elements opening the gallery.
3. Add the **dataset src** and **alt** attributes to the elements opening the gallery:

| Attribute      | Description                                                                                                                  |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `data-src`     | **(Required)** The path to the image that will be displayed when the element in the gallery is clicked.                      |
| `data-alt`     | **(Required)** The textual description of the image that will be displayed as alternate text when the image cannot be shown. |
| `data-caption` | An optional description of the image that will be displayed in the gallery.                                                  |

## Example Usage

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Lightbox Example</title>
    <link rel="stylesheet" href="lightbox.min.css" />
    <script src="lightbox.min.js" defer></script>
  </head>
  <body>
    <div class="lightbox-container">
      <img
        class="lightbox-image"
        src="thumbnail1.jpg"
        data-src="fullsize1.jpg"
        data-alt="Image Description 1"
        data-caption="Additional description 1"
      />
      <img
        class="lightbox-image"
        src="thumbnail2.jpg"
        data-src="fullsize2.jpg"
        data-alt="Image Description 2"
      />
      <img
        class="lightbox-image"
        src="thumbnail3.jpg"
        data-src="fullsize3.jpg"
        data-alt="Image Description 3"
        data-caption="Additional description 3"
      />
    </div>
  </body>
</html>
```

## Notes

- Make sure the paths to image files are correct.
- The **"lightbox-container"** class can be assigned to more than one element, creating multiple independent galleries.
- The **"lightbox-image"** class must be assigned to each element opening the gallery.
