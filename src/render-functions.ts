import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import type { PixabayImage } from "./types/pixabay";

export interface RenderElements {
  gallery: HTMLUListElement | null;
  loader: HTMLElement | null;
  loadMoreBtn: HTMLButtonElement | null;
}

export interface RenderAPI {
  clear: () => void;
  showLoader: () => void;
  hideLoader: () => void;
  showLoadMore: () => void;
  hideLoadMore: () => void;
  renderGallery: (images: PixabayImage[]) => void;
}

export function initRender({
  gallery,
  loader,
  loadMoreBtn,
}: RenderElements): RenderAPI {
  if (!gallery || !loader || !loadMoreBtn) {
    throw new Error("Critical elements not found in DOM");
  }

  const lightbox = new SimpleLightbox(".gallery a", {
    captionsData: "alt",
    captionDelay: 250,
  });

  const toggleVisibility = (element: HTMLElement, isVisible: boolean) => {
    element.classList.toggle("hidden", !isVisible);
  };

  const createImageMarkup = (image: PixabayImage): string => `
    <li class="gallery-item">
      <a class="gallery-link" href="${image.largeImageURL}">
        <img
          class="gallery-image"
          src="${image.webformatURL}"
          alt="${image.tags}"
          width="360"
        />
      </a>
      <div class="stats-block">
        ${createStatsMarkup(image)}
      </div>
    </li>
  `;

  const createStatsMarkup = (image: PixabayImage): string => {
    const stats = [
      { title: "Likes", value: image.likes },
      { title: "Views", value: image.views },
      { title: "Comments", value: image.comments },
      { title: "Downloads", value: image.downloads },
    ];

    return stats
      .map(
        ({ title, value }) => `
          <div class="stat">
            <p class="stat-title">${title}</p>
            <p class="stat-value">${value}</p>
          </div>
        `,
      )
      .join("");
  };

  return {
    clear() {
      gallery.innerHTML = "";
    },
    showLoader() {
      toggleVisibility(loader, true);
    },
    hideLoader() {
      toggleVisibility(loader, false);
    },
    showLoadMore() {
      toggleVisibility(loadMoreBtn, true);
    },
    hideLoadMore() {
      toggleVisibility(loadMoreBtn, false);
    },
    renderGallery(images: PixabayImage[]) {
      const markup = images.map(createImageMarkup).join("");
      gallery.insertAdjacentHTML("beforeend", markup);
      lightbox.refresh();
    },
  };
}
