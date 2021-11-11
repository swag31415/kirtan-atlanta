// Toasts
const toast = (msg, classes = "") => M.toast({html: msg, classes: classes})
const succ = (msg) => toast(msg, "green")
const fail = (msg) => toast(msg, "red")

// Initialize the menu
$("#nav").children().clone().appendTo("#hamborger")
  .children("a").addClass("white-text")

// Materialize AutoInit
M.AutoInit();

// 'TODO' Floats
$(".TODO").click(() => toast("TODO, haven't implemented that yet"))

// Convenient Async Image Reader
function read_image(file) {
  let FR = new FileReader()
  return new Promise(res => {
    if (file.name) {
      FR.addEventListener('load', e => res(e.target.result))
      FR.readAsDataURL(file)
    } else res('')
  })
}

// Event Loader
function load_events(elem_id, events) {
  let elem = document.getElementById(elem_id)
  events.forEach(event => {
    $(
     `<div class="card deep-orange">
        <div class="card-image">
          <a href="${event.link}"><img src="${event.image}"></a>
        </div>
        <div class="card-content white-text">
          <span class="card-title">${event.name}</span>
          <p>${event.desc}</p>
        </div>
      </div>`
    ).appendTo(elem)
  })
}