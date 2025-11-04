// Accordion Function
document.querySelectorAll(".accordion").forEach((acc) => {
  acc.addEventListener("click", function () {
    this.classList.toggle("active");
    let panel = this.nextElementSibling;
    panel.style.display = panel.style.display === "block" ? "none" : "block";
  });
});

// Tabs
function openTab(evt, tabName) {
  const tabcontent = document.querySelectorAll(".tab-content");
  tabcontent.forEach((tab) => (tab.style.display = "none"));
  document.querySelectorAll(".tab-link").forEach((tab) =>
    tab.classList.remove("active")
  );
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.classList.add("active");
}

// Modal Function
const modal = document.getElementById("myModal");
const openModal = document.getElementById("openModal");
const closeModal = document.querySelector(".close-modal");

if (openModal && modal && closeModal) {
  openModal.addEventListener("click", () => (modal.style.display = "block"));
  closeModal.addEventListener("click", () => (modal.style.display = "none"));
  window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });
}

