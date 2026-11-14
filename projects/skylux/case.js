// Lightbox for the screenshots: every <a class="zoom"> opens its href full size.
// Without JavaScript (or <dialog>) the links simply open the image.
(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll("a.zoom"));
  if (!links.length || typeof HTMLDialogElement !== "function") return;

  var tr = document.documentElement.lang === "tr";
  var dialog = document.createElement("dialog");
  dialog.className = "lightbox";
  dialog.setAttribute("aria-label", tr ? "Ekran görüntüsü" : "Screenshot");
  dialog.innerHTML =
    '<img alt=""><p></p>' +
    '<button type="button" class="lb-btn lb-close" aria-label="' + (tr ? "Kapat" : "Close") + '">&times;</button>' +
    '<button type="button" class="lb-btn lb-prev" aria-label="' + (tr ? "Önceki" : "Previous") + '">&larr;</button>' +
    '<button type="button" class="lb-btn lb-next" aria-label="' + (tr ? "Sonraki" : "Next") + '">&rarr;</button>';
  document.body.appendChild(dialog);

  var image = dialog.querySelector("img");
  var caption = dialog.querySelector("p");
  var index = 0;

  function show(i) {
    index = (i + links.length) % links.length;
    var link = links[index];
    var thumb = link.querySelector("img");
    var figure = link.closest("figure");
    var figcaption = figure && figure.querySelector("figcaption");
    image.src = link.getAttribute("href");
    image.alt = thumb ? thumb.alt : "";
    caption.textContent = link.getAttribute("data-caption") || (figcaption ? figcaption.textContent : "");
  }

  links.forEach(function (link, i) {
    link.addEventListener("click", function (event) {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      show(i);
      dialog.showModal();
    });
  });

  dialog.querySelector(".lb-close").addEventListener("click", function () {
    dialog.close();
  });
  dialog.querySelector(".lb-prev").addEventListener("click", function () {
    show(index - 1);
  });
  dialog.querySelector(".lb-next").addEventListener("click", function () {
    show(index + 1);
  });
  // A click on the backdrop lands on the dialog element itself.
  dialog.addEventListener("click", function (event) {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") show(index - 1);
    if (event.key === "ArrowRight") show(index + 1);
  });
  dialog.addEventListener("close", function () {
    image.removeAttribute("src");
    links[index].focus();
  });
})();
