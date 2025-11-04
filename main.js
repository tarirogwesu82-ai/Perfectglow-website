//Accord Fun 
document.querySelectorAll("accordion").forEach(acc) => {
 acc.addEventListener("click", function () {
 this.classList.toggle("active");
   let panel = this.nextElementSibling;
   panel.style.display = panel.style.display === "block" ? "none" : "block"
   });
}};

//tabs
functions opentab(evt, tabname) {
  const tabcontent = document.querySelectionAll("tab-content");
  tabcontent.forEach{(tab) => (tab.style.display = none);
  document.queryselectorAll('.tabs-link').forEach(tab => tab.classList).remove('')
}
