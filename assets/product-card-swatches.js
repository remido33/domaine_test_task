// @ts-nocheck
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

class PCard extends HTMLElement {
  #resizeObserver = new ResizeObserver(() =>
    requestAnimationFrame(() => this.#syncStripScroll()),
  );

  get #strip() {
    return this.querySelector(".pcard__images");
  }
  get #hoverImg() {
    return this.querySelector(".pcard__hover-img");
  }
  get #hoverLayer() {
    return this.querySelector(".pcard__images-hover");
  }
  get #media() {
    return this.querySelector(".pcard__media");
  }
  get #activeBtn() {
    return this.querySelector("button.pcard__swatch.active");
  }

  connectedCallback() {
    this.addEventListener("click", this.#onClick);
    this.#media?.addEventListener("mouseenter", this.#onMediaEnter);
    this.#media?.addEventListener("mouseleave", this.#onMediaLeave);
    this.#resizeObserver.observe(this);
    this.#syncHoverFromActive();
    this.#syncStripScroll();
    const activeBtn = this.#activeBtn;
    if (activeBtn) this.#updateLinks(activeBtn);
  }

  disconnectedCallback() {
    this.removeEventListener("click", this.#onClick);
    this.#resizeObserver.disconnect();
  }

  #onClick = (event) => {
    const button = event.target?.closest("button.pcard__swatch");
    if (!button) return;

    this.querySelectorAll("button.pcard__swatch.active").forEach((el) =>
      el.classList.remove("active"),
    );
    button.classList.add("active");

    this.#updatePrice(button);
    this.#updateLinks(button);
    this.#syncHoverFromActive();
    this.#scrollStripTo(button);

    if (!this.#hoverImg?.getAttribute("src")) {
      this.#hoverLayer?.classList.remove("tw:opacity-100");
    }
  };

  #onMediaEnter = () => {
    this.#syncHoverFromActive();
    if (this.#hoverImg?.getAttribute("src"))
      this.#hoverLayer?.classList.add("tw:opacity-100");
  };

  #onMediaLeave = () => {
    this.#hoverLayer?.classList.remove("tw:opacity-100");
  };

  #updatePrice(button) {
    const { price, comparePrice } = button.dataset;
    const priceEl = this.querySelector(".pcard__price");
    const comparePriceEl = this.querySelector(".pcard__compare-price");

    if (priceEl && price) priceEl.textContent = price;
    if (comparePriceEl) {
      comparePriceEl.hidden = !comparePrice;
      if (comparePrice) comparePriceEl.textContent = comparePrice;
    }
  }

  #updateLinks(button) {
    const { variantUrl } = button.dataset;
    if (!variantUrl) return;
    this.querySelectorAll("a[href]").forEach((a) => (a.href = variantUrl));
  }

  #syncHoverFromActive() {
    const img = this.#hoverImg;
    if (!img) return;

    const btn = this.#activeBtn;
    const src = btn?.dataset.hoverSrc;
    const srcset = btn?.dataset.hoverSrcset;

    img.alt = btn?.dataset.hoverAlt ?? "";
    srcset ? (img.srcset = srcset) : img.removeAttribute("srcset");
    src ? (img.src = src) : img.removeAttribute("src");
  }

  #scrollStripTo(button) {
    const { swatchIndex } = button.dataset;
    if (swatchIndex === undefined) return;
    const slide = this.#strip?.querySelector(
      `[data-swatch-index="${CSS.escape(swatchIndex)}"]`,
    );
    if (slide)
      this.#strip?.scrollTo({
        left: slide.offsetLeft,
        behavior: reducedMotion.matches ? "auto" : "smooth",
      });
  }

  #syncStripScroll() {
    const index = this.#activeBtn?.dataset.swatchIndex;
    if (index === undefined) {
      this.#strip?.scrollTo({ left: 0, behavior: "auto" });
      return;
    }
    const slide = this.#strip?.querySelector(
      `[data-swatch-index="${CSS.escape(index)}"]`,
    );
    if (slide)
      this.#strip?.scrollTo({ left: slide.offsetLeft, behavior: "auto" });
  }
}

if (!customElements.get("p-card")) customElements.define("p-card", PCard);
