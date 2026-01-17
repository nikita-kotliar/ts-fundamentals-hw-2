
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

export function initRender(elements: RenderElements): RenderAPI {
  if (!elements.gallery || !elements.loader || !elements.loadMoreBtn) {
    throw new Error("Critical elements not found in DOM");
  }

  const { gallery, loader, loadMoreBtn } = elements;

  const lightbox = new SimpleLightbox(".gallery a", {
    captionsData: "alt",
    captionDelay: 250,
  });

  return {
    clear() {
      gallery.innerHTML = "";
    },
    showLoader() {
      loader.classList.remove("hidden"); 
    },
    hideLoader() {
      loader.classList.add("hidden");
    },
    showLoadMore() {
      loadMoreBtn.classList.remove("hidden");
    },
    hideLoadMore() {
      loadMoreBtn.classList.add("hidden");
    },
    renderGallery(images: PixabayImage[]) {
      const markup = images
        .map((image) => {
          return `
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
                 <div class="stat">
                    <p class="stat-title">Likes</p>
                    <p class="stat-value">${image.likes}</p>
                 </div>
                 <div class="stat">
                    <p class="stat-title">Views</p>
                    <p class="stat-value">${image.views}</p>
                 </div>
                 <div class="stat">
                    <p class="stat-title">Comments</p>
                    <p class="stat-value">${image.comments}</p>
                 </div>
                 <div class="stat">
                    <p class="stat-title">Downloads</p>
                    <p class="stat-value">${image.downloads}</p>
                 </div>
              </div>
            </li>
          `;
        })
        .join("");

      gallery.insertAdjacentHTML("beforeend", markup);
      lightbox.refresh();
    },
  };
}
