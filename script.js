const root = document.documentElement;
const body = document.body;
const glow = document.querySelector(".cursor-glow");
const parallaxItems = document.querySelectorAll("[data-depth]");
const cards = document.querySelectorAll(".work-card");
const revealItems = document.querySelectorAll(".reveal, .showcase, .system-panel");
const directoryCards = document.querySelectorAll(".directory-card");
const dynamicSection = document.querySelector(".dynamic-section");
const dynamicCards = document.querySelectorAll(".dynamic-card");
const lightbox = document.querySelector(".lightbox");
const lightboxImage = document.querySelector(".lightbox img");
const lightboxCaption = document.querySelector(".lightbox figcaption");
const lightboxClose = document.querySelector(".lightbox-close");
const lightboxPrev = document.querySelector(".lightbox-prev");
const lightboxNext = document.querySelector(".lightbox-next");
const ipSection = document.querySelector(".ip-section");
const ipStage = document.querySelector(".ip-stage");
const ipImageShell = document.querySelector(".ip-image-shell");
const ipProgressFill = document.querySelector(".ip-progress");
const ipProgressLabel = document.querySelector(".ip-progress b");
const ipBackTop = document.querySelector(".ip-backtop");
const ipViewer = document.querySelector(".ip-viewer");
const ipViewerClose = document.querySelector(".ip-viewer-close");
const detailSection = document.querySelector(".detail-section");
const detailPieces = document.querySelectorAll(".detail-piece");
const detailImageShells = document.querySelectorAll(".detail-image-shell");
const detailViewer = document.querySelector(".detail-viewer");
const detailViewerImage = document.querySelector(".detail-viewer img");
const detailViewerScroll = document.querySelector(".detail-viewer-scroll");
const detailViewerClose = document.querySelector(".detail-viewer-close");
const detailViewerPrev = document.querySelector(".detail-viewer-prev");
const detailViewerNext = document.querySelector(".detail-viewer-next");
const detailZoomOut = document.querySelector(".detail-zoom-out");
const detailZoomReset = document.querySelector(".detail-zoom-reset");
const detailZoomIn = document.querySelector(".detail-zoom-in");
const productSection = document.querySelector(".product-section");
const productGrid = document.querySelector(".product-grid");
const productCards = document.querySelectorAll(".product-card");
const productViewer = document.querySelector(".product-viewer");
const productViewerImage = document.querySelector(".product-viewer img");
const productViewerCaption = document.querySelector(".product-viewer figcaption");
const productViewerClose = document.querySelector(".product-viewer-close");
const productViewerPrev = document.querySelector(".product-viewer-prev");
const productViewerNext = document.querySelector(".product-viewer-next");
const brandSection = document.querySelector(".brand-section");
const brandImageShell = document.querySelector(".brand-image-shell");
const brandProgressFill = document.querySelector(".brand-progress");
const brandProgressLabel = document.querySelector(".brand-progress b");
const brandViewer = document.querySelector(".brand-viewer");
const brandViewerClose = document.querySelector(".brand-viewer-close");
const motionSection = document.querySelector(".motion-section");
const motionConsole = document.querySelector(".motion-console");
const motionScreens = document.querySelectorAll(".motion-screen");
const motionPickers = document.querySelectorAll(".motion-picker");
const motionViewer = document.querySelector(".motion-viewer");
const motionViewerVideo = document.querySelector(".motion-viewer video");
const motionViewerCaption = document.querySelector(".motion-viewer figcaption");
const motionViewerClose = document.querySelector(".motion-viewer-close");
const motionViewerPrev = document.querySelector(".motion-viewer-prev");
const motionViewerNext = document.querySelector(".motion-viewer-next");

let moveTimer = 0;
let activeDynamicIndex = 0;
let activeDetailIndex = 0;
let activeProductIndex = 0;
let activeMotionIndex = 0;
let touchStartX = 0;
let detailZoom = 1;

function setScrollState() {
  const progress = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1);
  root.style.setProperty("--scroll-progress", progress.toFixed(3));
  body.classList.toggle("scrolled", progress > 0.02);

  if (dynamicSection && dynamicCards.length) {
    const rect = dynamicSection.getBoundingClientRect();
    const sectionProgress = (window.innerHeight - rect.top) / Math.max(window.innerHeight + rect.height, 1);
    const parallax = (Math.min(Math.max(sectionProgress, 0), 1) - 0.5) * -28;
    dynamicCards.forEach((card) => {
      card.style.setProperty("--parallax-y", `${parallax.toFixed(2)}px`);
    });
    dynamicSection.classList.toggle("is-leaving", rect.bottom < window.innerHeight * 0.42);
  }

  if (ipSection) {
    const rect = ipSection.getBoundingClientRect();
    const maxTravel = Math.max(rect.height - window.innerHeight, 1);
    const progress = Math.min(Math.max(-rect.top / maxTravel, 0), 1);
    const parallax = (progress - 0.5) * -36;
    ipSection.style.setProperty("--ip-progress", `${(progress * 100).toFixed(1)}%`);
    ipSection.style.setProperty("--ip-parallax-y", `${parallax.toFixed(2)}px`);
    ipProgressLabel && (ipProgressLabel.textContent = `${Math.round(progress * 100)}%`);
    ipProgressFill?.classList.toggle("is-active", rect.top < window.innerHeight && rect.bottom > 0);
  }

  if (detailSection && detailPieces.length) {
    const rect = detailSection.getBoundingClientRect();
    const progress = (window.innerHeight - rect.top) / Math.max(window.innerHeight + rect.height, 1);
    const parallax = (Math.min(Math.max(progress, 0), 1) - 0.5) * -34;
    detailPieces.forEach((piece, index) => {
      piece.style.setProperty("--detail-parallax-y", `${(parallax * (index === 0 ? 0.7 : 1)).toFixed(2)}px`);
    });
  }

  if (productSection && productCards.length) {
    const rect = productSection.getBoundingClientRect();
    const progress = (window.innerHeight - rect.top) / Math.max(window.innerHeight + rect.height, 1);
    const clamped = Math.min(Math.max(progress, 0), 1);
    productSection.style.setProperty("--product-model-y", `${((clamped - 0.5) * -42).toFixed(2)}px`);
    productCards.forEach((card, index) => {
      const depth = index % 2 === 0 ? 22 : 34;
      card.style.setProperty("--product-card-y", `${((clamped - 0.5) * -depth).toFixed(2)}px`);
    });
  }

  if (brandSection) {
    const rect = brandSection.getBoundingClientRect();
    const maxTravel = Math.max(rect.height - window.innerHeight, 1);
    const progress = Math.min(Math.max(-rect.top / maxTravel, 0), 1);
    brandSection.style.setProperty("--brand-progress", `${(progress * 100).toFixed(1)}%`);
    brandSection.style.setProperty("--brand-parallax-y", `${((progress - 0.5) * -36).toFixed(2)}px`);
    brandProgressLabel && (brandProgressLabel.textContent = `${Math.round(progress * 100)}%`);
    brandProgressFill?.classList.toggle("is-active", rect.top < window.innerHeight && rect.bottom > 0);
  }

  if (motionSection && motionConsole) {
    const rect = motionSection.getBoundingClientRect();
    const progress = (window.innerHeight - rect.top) / Math.max(window.innerHeight + rect.height, 1);
    const clamped = Math.min(Math.max(progress, 0), 1);
    motionConsole.style.setProperty("--motion-parallax-y", `${((clamped - 0.5) * -42).toFixed(2)}px`);
  }
}

function handlePointerMove(event) {
  const x = event.clientX;
  const y = event.clientY;
  const dx = x / window.innerWidth - 0.5;
  const dy = y / window.innerHeight - 0.5;

  glow.style.transform = `translate3d(${x}px, ${y}px, 0) translate3d(-50%, -50%, 0)`;
  body.classList.add("is-moving");
  clearTimeout(moveTimer);
  moveTimer = setTimeout(() => body.classList.remove("is-moving"), 900);

  parallaxItems.forEach((item) => {
    const depth = Number(item.dataset.depth || 0);
    const tx = (dx * depth * 180).toFixed(2);
    const ty = (dy * depth * 140).toFixed(2);
    item.style.setProperty("--mx", `${tx}px`);
    item.style.setProperty("--my", `${ty}px`);
    if (!item.classList.contains("work-card")) {
      item.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
    }
  });

  if (dynamicSection) {
    const rect = dynamicSection.getBoundingClientRect();
    if (y >= rect.top && y <= rect.bottom) {
      dynamicSection.style.setProperty("--grid-x", `${((x / window.innerWidth) * 100).toFixed(2)}%`);
      dynamicSection.style.setProperty("--grid-y", `${(((y - rect.top) / Math.max(rect.height, 1)) * 100).toFixed(2)}%`);
    }
  }

  if (ipSection) {
    const rect = ipSection.getBoundingClientRect();
    if (y >= rect.top && y <= rect.bottom) {
      ipSection.style.setProperty("--ip-grid-x", `${((x / window.innerWidth) * 100).toFixed(2)}%`);
      ipSection.style.setProperty("--ip-grid-y", `${(((y - rect.top) / Math.max(rect.height, 1)) * 100).toFixed(2)}%`);
    }
  }

  if (detailSection) {
    const rect = detailSection.getBoundingClientRect();
    if (y >= rect.top && y <= rect.bottom) {
      detailSection.style.setProperty("--detail-grid-x", `${((x / window.innerWidth) * 100).toFixed(2)}%`);
      detailSection.style.setProperty("--detail-grid-y", `${(((y - rect.top) / Math.max(rect.height, 1)) * 100).toFixed(2)}%`);
    }
  }

  if (productSection) {
    const rect = productSection.getBoundingClientRect();
    if (y >= rect.top && y <= rect.bottom) {
      productSection.style.setProperty("--product-grid-x", `${((x / window.innerWidth) * 100).toFixed(2)}%`);
      productSection.style.setProperty("--product-grid-y", `${(((y - rect.top) / Math.max(rect.height, 1)) * 100).toFixed(2)}%`);
    }
  }

  if (brandSection) {
    const rect = brandSection.getBoundingClientRect();
    if (y >= rect.top && y <= rect.bottom) {
      brandSection.style.setProperty("--brand-grid-x", `${((x / window.innerWidth) * 100).toFixed(2)}%`);
      brandSection.style.setProperty("--brand-grid-y", `${(((y - rect.top) / Math.max(rect.height, 1)) * 100).toFixed(2)}%`);
    }
  }

  if (motionSection) {
    const rect = motionSection.getBoundingClientRect();
    if (y >= rect.top && y <= rect.bottom) {
      motionSection.style.setProperty("--motion-grid-x", `${((x / window.innerWidth) * 100).toFixed(2)}%`);
      motionSection.style.setProperty("--motion-grid-y", `${(((y - rect.top) / Math.max(rect.height, 1)) * 100).toFixed(2)}%`);
    }
  }
}

cards.forEach((card, index) => {
  const fromX = index % 2 === 0 ? "-90px" : "90px";
  card.style.setProperty("--from-x", fromX);
  card.style.setProperty("--from-y", index < 2 ? "-70px" : "90px");

  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.setProperty("--rx", `${(-py * 10).toFixed(2)}deg`);
    card.style.setProperty("--ry", `${(px * 10).toFixed(2)}deg`);
  });

  card.addEventListener("pointerleave", () => {
    card.style.setProperty("--rx", "0deg");
    card.style.setProperty("--ry", "0deg");
  });
});

directoryCards.forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const px = ((event.clientX - rect.left) / rect.width - 0.5).toFixed(3);
    const py = ((event.clientY - rect.top) / rect.height - 0.5).toFixed(3);
    card.style.setProperty("--shadow-x", `${Number(px) * 24}px`);
    card.style.setProperty("--shadow-y", `${Number(py) * 24}px`);
  });
});

dynamicCards.forEach((card, index) => {
  const image = card.querySelector("img");
  if (image.complete) {
    card.classList.add("is-loaded");
  } else {
    image.addEventListener("load", () => card.classList.add("is-loaded"), { once: true });
  }

  card.addEventListener("click", () => openLightbox(index));
});

function setLightboxImage(index) {
  if (!lightboxImage || !lightboxCaption || !dynamicCards.length) return;
  activeDynamicIndex = (index + dynamicCards.length) % dynamicCards.length;
  const card = dynamicCards[activeDynamicIndex];
  const image = card.querySelector("img");
  lightboxImage.style.opacity = "0";
  lightboxImage.style.transform = "scale(0.96)";
  window.setTimeout(() => {
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent = `#${String(activeDynamicIndex + 1).padStart(2, "0")}`;
    lightboxImage.style.opacity = "1";
    lightboxImage.style.transform = "scale(1)";
  }, 120);
}

function openLightbox(index) {
  if (!lightbox) return;
  setLightboxImage(index);
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  body.style.overflow = "hidden";
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  body.style.overflow = "";
}

function showPrevImage() {
  setLightboxImage(activeDynamicIndex - 1);
}

function showNextImage() {
  setLightboxImage(activeDynamicIndex + 1);
}

lightboxClose?.addEventListener("click", closeLightbox);
lightboxPrev?.addEventListener("click", showPrevImage);
lightboxNext?.addEventListener("click", showNextImage);

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

lightbox?.addEventListener("touchstart", (event) => {
  touchStartX = event.changedTouches[0].clientX;
}, { passive: true });

lightbox?.addEventListener("touchend", (event) => {
  const dx = event.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 42) {
    dx > 0 ? showPrevImage() : showNextImage();
  }
}, { passive: true });

ipImageShell?.addEventListener("pointermove", (event) => {
  const rect = ipImageShell.getBoundingClientRect();
  const px = ((event.clientX - rect.left) / Math.max(rect.width, 1)) * 100;
  const py = ((event.clientY - rect.top) / Math.max(rect.height, 1)) * 100;
  ipImageShell.style.setProperty("--ip-focus-x", `${px.toFixed(2)}%`);
  ipImageShell.style.setProperty("--ip-focus-y", `${py.toFixed(2)}%`);
});

ipImageShell?.addEventListener("click", () => {
  if (!ipViewer) return;
  ipViewer.classList.add("is-open");
  ipViewer.setAttribute("aria-hidden", "false");
  body.style.overflow = "hidden";
});

function closeIpViewer() {
  if (!ipViewer) return;
  ipViewer.classList.remove("is-open");
  ipViewer.setAttribute("aria-hidden", "true");
  body.style.overflow = "";
}

ipViewerClose?.addEventListener("click", closeIpViewer);

ipViewer?.addEventListener("click", (event) => {
  if (event.target === ipViewer) closeIpViewer();
});

ipBackTop?.addEventListener("click", () => {
  ipSection?.scrollIntoView({ behavior: "smooth", block: "start" });
});

detailImageShells.forEach((shell, index) => {
  shell.addEventListener("pointermove", (event) => {
    const rect = shell.getBoundingClientRect();
    const px = ((event.clientX - rect.left) / Math.max(rect.width, 1)) * 100;
    const py = ((event.clientY - rect.top) / Math.max(rect.height, 1)) * 100;
    shell.style.setProperty("--detail-focus-x", `${px.toFixed(2)}%`);
    shell.style.setProperty("--detail-focus-y", `${py.toFixed(2)}%`);
  });

  shell.addEventListener("click", () => openDetailViewer(index));
});

function setDetailZoom(value, preserveCenter = true) {
  if (!detailViewerScroll) return;
  const previousScrollWidth = Math.max(detailViewerScroll.scrollWidth, 1);
  const previousScrollHeight = Math.max(detailViewerScroll.scrollHeight, 1);
  const centerX = (detailViewerScroll.scrollLeft + detailViewerScroll.clientWidth / 2) / previousScrollWidth;
  const centerY = (detailViewerScroll.scrollTop + detailViewerScroll.clientHeight / 2) / previousScrollHeight;

  detailZoom = Math.min(Math.max(value, 0.55), 2.4);
  detailViewerScroll.style.setProperty("--detail-zoom", detailZoom.toFixed(2));
  detailViewerScroll.style.setProperty("--detail-image-width", `${(detailZoom * 100).toFixed(0)}%`);
  if (detailZoomReset) detailZoomReset.textContent = `${Math.round(detailZoom * 100)}%`;

  if (!preserveCenter) {
    detailViewerScroll.scrollTo({ left: 0, top: 0 });
    return;
  }

  requestAnimationFrame(() => {
    detailViewerScroll.scrollLeft = Math.max(0, detailViewerScroll.scrollWidth * centerX - detailViewerScroll.clientWidth / 2);
    detailViewerScroll.scrollTop = Math.max(0, detailViewerScroll.scrollHeight * centerY - detailViewerScroll.clientHeight / 2);
  });
}

function resetDetailZoom() {
  setDetailZoom(1, false);
}

function setDetailViewerImage(index) {
  if (!detailViewerImage || !detailImageShells.length) return;
  activeDetailIndex = (index + detailImageShells.length) % detailImageShells.length;
  const image = detailImageShells[activeDetailIndex].querySelector("img");
  resetDetailZoom();
  detailViewerImage.style.opacity = "0";
  window.setTimeout(() => {
    detailViewerImage.src = image.src;
    detailViewerImage.alt = image.alt;
    detailViewerImage.style.opacity = "1";
  }, 120);
}

function openDetailViewer(index) {
  if (!detailViewer) return;
  setDetailViewerImage(index);
  detailViewer.classList.add("is-open");
  detailViewer.setAttribute("aria-hidden", "false");
  body.style.overflow = "hidden";
}

function closeDetailViewer() {
  if (!detailViewer) return;
  detailViewer.classList.remove("is-open");
  detailViewer.setAttribute("aria-hidden", "true");
  body.style.overflow = "";
}

function showPrevDetail() {
  setDetailViewerImage(activeDetailIndex - 1);
}

function showNextDetail() {
  setDetailViewerImage(activeDetailIndex + 1);
}

detailViewerClose?.addEventListener("click", closeDetailViewer);
detailViewerPrev?.addEventListener("click", showPrevDetail);
detailViewerNext?.addEventListener("click", showNextDetail);
detailZoomOut?.addEventListener("click", () => setDetailZoom(detailZoom - 0.15));
detailZoomIn?.addEventListener("click", () => setDetailZoom(detailZoom + 0.15));
detailZoomReset?.addEventListener("click", resetDetailZoom);

detailViewerScroll?.addEventListener(
  "wheel",
  (event) => {
    if (!detailViewer?.classList.contains("is-open") || (!event.ctrlKey && !event.metaKey)) return;
    event.preventDefault();
    setDetailZoom(detailZoom + (event.deltaY < 0 ? 0.08 : -0.08));
  },
  { passive: false },
);

detailViewerScroll?.addEventListener("dblclick", () => {
  setDetailZoom(detailZoom > 1.05 ? 1 : 1.55);
});

detailViewer?.addEventListener("click", (event) => {
  if (event.target === detailViewer) closeDetailViewer();
});

productCards.forEach((card, index) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const px = (event.clientX - rect.left) / Math.max(rect.width, 1);
    const py = (event.clientY - rect.top) / Math.max(rect.height, 1);
    card.style.setProperty("--product-focus-x", `${(px * 100).toFixed(2)}%`);
    card.style.setProperty("--product-focus-y", `${(py * 100).toFixed(2)}%`);
    card.style.setProperty("--product-rx", `${((0.5 - py) * 7).toFixed(2)}deg`);
    card.style.setProperty("--product-ry", `${((px - 0.5) * 7).toFixed(2)}deg`);
  });

  card.addEventListener("pointerleave", () => {
    card.style.setProperty("--product-rx", "0deg");
    card.style.setProperty("--product-ry", "0deg");
  });

  card.addEventListener("click", () => openProductViewer(index));
});

function setProductViewerImage(index) {
  if (!productViewerImage || !productViewerCaption || !productCards.length) return;
  activeProductIndex = (index + productCards.length) % productCards.length;
  const card = productCards[activeProductIndex];
  const image = card.querySelector("img");
  const caption = card.querySelector("span");
  productViewerImage.style.opacity = "0";
  productViewerImage.style.transform = "scale(0.96)";
  window.setTimeout(() => {
    productViewerImage.src = image.src;
    productViewerImage.alt = image.alt;
    productViewerCaption.textContent = caption.textContent;
    productViewerImage.style.opacity = "1";
    productViewerImage.style.transform = "scale(1)";
  }, 120);
}

function openProductViewer(index) {
  if (!productViewer) return;
  setProductViewerImage(index);
  productViewer.classList.add("is-open");
  productViewer.setAttribute("aria-hidden", "false");
  body.style.overflow = "hidden";
}

function closeProductViewer() {
  if (!productViewer) return;
  productViewer.classList.remove("is-open");
  productViewer.setAttribute("aria-hidden", "true");
  body.style.overflow = "";
}

function showPrevProduct() {
  setProductViewerImage(activeProductIndex - 1);
}

function showNextProduct() {
  setProductViewerImage(activeProductIndex + 1);
}

productViewerClose?.addEventListener("click", closeProductViewer);
productViewerPrev?.addEventListener("click", showPrevProduct);
productViewerNext?.addEventListener("click", showNextProduct);

productViewer?.addEventListener("click", (event) => {
  if (event.target === productViewer) closeProductViewer();
});

productGrid?.addEventListener("wheel", (event) => {
  const maxScroll = productGrid.scrollWidth - productGrid.clientWidth;
  const wantsRight = event.deltaY > 0;
  const canScrollRight = productGrid.scrollLeft < maxScroll - 2;
  const canScrollLeft = productGrid.scrollLeft > 2;
  if ((wantsRight && canScrollRight) || (!wantsRight && canScrollLeft)) {
    event.preventDefault();
    productGrid.scrollBy({ left: event.deltaY * 1.08, behavior: "smooth" });
  }
}, { passive: false });

brandImageShell?.addEventListener("pointermove", (event) => {
  const rect = brandImageShell.getBoundingClientRect();
  const px = ((event.clientX - rect.left) / Math.max(rect.width, 1)) * 100;
  const py = ((event.clientY - rect.top) / Math.max(rect.height, 1)) * 100;
  brandImageShell.style.setProperty("--brand-focus-x", `${px.toFixed(2)}%`);
  brandImageShell.style.setProperty("--brand-focus-y", `${py.toFixed(2)}%`);
});

brandImageShell?.addEventListener("click", () => {
  if (!brandViewer) return;
  brandViewer.classList.add("is-open");
  brandViewer.setAttribute("aria-hidden", "false");
  body.style.overflow = "hidden";
});

function closeBrandViewer() {
  if (!brandViewer) return;
  brandViewer.classList.remove("is-open");
  brandViewer.setAttribute("aria-hidden", "true");
  body.style.overflow = "";
}

brandViewerClose?.addEventListener("click", closeBrandViewer);

brandViewer?.addEventListener("click", (event) => {
  if (event.target === brandViewer) closeBrandViewer();
});

function setActiveMotion(index) {
  if (!motionScreens.length) return;
  activeMotionIndex = (index + motionScreens.length) % motionScreens.length;
  motionSection?.style.setProperty("--motion-active", activeMotionIndex);
  motionScreens.forEach((screen, screenIndex) => {
    const video = screen.querySelector("video");
    const isActive = screenIndex === activeMotionIndex;
    screen.classList.toggle("is-active", isActive);
    motionPickers[screenIndex]?.classList.toggle("is-active", isActive);
    if (isActive) {
      video?.play?.().catch(() => {});
    } else {
      video?.pause?.();
    }
  });
}

motionScreens.forEach((screen, index) => {
  const video = screen.querySelector("video");
  screen.addEventListener("pointermove", (event) => {
    const rect = screen.getBoundingClientRect();
    const px = ((event.clientX - rect.left) / Math.max(rect.width, 1)) * 100;
    const py = ((event.clientY - rect.top) / Math.max(rect.height, 1)) * 100;
    screen.style.setProperty("--motion-focus-x", `${px.toFixed(2)}%`);
    screen.style.setProperty("--motion-focus-y", `${py.toFixed(2)}%`);
  });
  screen.addEventListener("mouseenter", () => setActiveMotion(index));
  screen.addEventListener("click", () => openMotionViewer(index));
  video?.addEventListener("timeupdate", () => {
    if (!video.duration || !motionPickers[index]) return;
    motionPickers[index].style.setProperty("--motion-progress", `${((video.currentTime / video.duration) * 100).toFixed(2)}%`);
  });
});

motionPickers.forEach((picker, index) => {
  picker.addEventListener("click", () => setActiveMotion(index));
});

function setMotionViewerVideo(index) {
  if (!motionViewerVideo || !motionViewerCaption || !motionScreens.length) return;
  activeMotionIndex = (index + motionScreens.length) % motionScreens.length;
  setActiveMotion(activeMotionIndex);
  const screen = motionScreens[activeMotionIndex];
  const video = screen.querySelector("video");
  const caption = screen.querySelector("b");
  motionViewerVideo.pause();
  motionViewerVideo.src = video.currentSrc || video.src;
  motionViewerVideo.load();
  motionViewerCaption.textContent = caption.textContent;
}

function openMotionViewer(index) {
  if (!motionViewer) return;
  setMotionViewerVideo(index);
  motionViewer.classList.add("is-open");
  motionViewer.setAttribute("aria-hidden", "false");
  body.style.overflow = "hidden";
  motionViewerVideo?.play?.().catch(() => {});
}

function closeMotionViewer() {
  if (!motionViewer) return;
  motionViewer.classList.remove("is-open");
  motionViewer.setAttribute("aria-hidden", "true");
  motionViewerVideo?.pause?.();
  body.style.overflow = "";
}

function showPrevMotion() {
  setMotionViewerVideo(activeMotionIndex - 1);
  motionViewerVideo?.play?.().catch(() => {});
}

function showNextMotion() {
  setMotionViewerVideo(activeMotionIndex + 1);
  motionViewerVideo?.play?.().catch(() => {});
}

motionViewerClose?.addEventListener("click", closeMotionViewer);
motionViewerPrev?.addEventListener("click", showPrevMotion);
motionViewerNext?.addEventListener("click", showNextMotion);

motionViewer?.addEventListener("click", (event) => {
  if (event.target === motionViewer) closeMotionViewer();
});

window.addEventListener("keydown", (event) => {
  if (motionViewer?.classList.contains("is-open")) {
    if (event.key === "Escape") closeMotionViewer();
    if (event.key === "ArrowLeft") showPrevMotion();
    if (event.key === "ArrowRight") showNextMotion();
    return;
  }
  if (event.key === "Escape" && brandViewer?.classList.contains("is-open")) {
    closeBrandViewer();
    return;
  }
  if (productViewer?.classList.contains("is-open")) {
    if (event.key === "Escape") closeProductViewer();
    if (event.key === "ArrowLeft") showPrevProduct();
    if (event.key === "ArrowRight") showNextProduct();
    return;
  }
  if (detailViewer?.classList.contains("is-open")) {
    if (event.key === "Escape") closeDetailViewer();
    if (event.key === "ArrowLeft") showPrevDetail();
    if (event.key === "ArrowRight") showNextDetail();
    if (event.key === "+" || event.key === "=") setDetailZoom(detailZoom + 0.15);
    if (event.key === "-") setDetailZoom(detailZoom - 0.15);
    if (event.key === "0") resetDetailZoom();
    return;
  }
  if (event.key === "Escape" && ipViewer?.classList.contains("is-open")) {
    closeIpViewer();
    return;
  }
  if (!lightbox?.classList.contains("is-open")) return;
  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") showPrevImage();
  if (event.key === "ArrowRight") showNextImage();
});

window.addEventListener("pointermove", handlePointerMove, { passive: true });
window.addEventListener("scroll", setScrollState, { passive: true });

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: [0.18, 0.5] }
);

revealItems.forEach((item) => {
  item.classList.add("reveal");
  revealObserver.observe(item);
});

setActiveMotion(0);
setScrollState();
