// Toasts
const toast = (msg, classes = "") => M.toast({html: msg, classes: classes})
const succ = (msg) => toast(msg, "green")
const fail = (msg) => toast(msg, "red")

// Initialize the menu
$("#nav").children().clone().appendTo("#hamborger")
  .children("a").addClass("white-text")

// Materialize AutoInit
M.AutoInit();

// Showdown
var converter = new showdown.Converter({
  noHeaderId: true,
  headerLevelStart: 4,
  simplifiedAutoLink: true,
  literalMidWordUnderscores: true,
  strikethrough: true,
  tables: true,
  tasklists: true,
  emoji: true
})
function md2html(md) {
  var elem = $(converter.makeHtml(md))
  elem.find('ul').addClass('browser-default')
  return elem
}

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
function get_card(event) {
  return ejs.render(
   `<div class="card orange accent-2 event">
      <% if (image) { %>
        <div class="card-image">
          <% if (link) { %> <a href="<%- link %>"> <% } %>
            <img src="<%- image %>">
          <% if (link) { %> </a> <% } %>
          <a id=<%- id %> class="btn-floating halfway-fab red delete-event super" href="#!">
            <i class="far fa-trash-alt"></i>
          </a>
        </div>
      <% } %>
      <div class="card-content white-text">
        <span class="card-title">
          <% if (!image && link) { %> <a href="<%- link %>"> <% } %>
            <%- name %>
          <% if (!image && link) { %> </a> <% } %>
          <% if (!image) { %>
            <a id=<%- id %> class="btn-floating right red delete-event super" href="#!">
              <i class="far fa-trash-alt"></i>
            </a>
          <% } %>
        </span>
        <% if (desc) { %>
          <%- md2html(desc).html() %>
        <% } %>
        <p <% if (!desc) { %> class="right" <% } %>><%- date %></p>
      </div>
    </div>`, event
  )
}

const one_day = 24*60*60*1000
function load_events(elem_id, events) {
  events.forEach(event => {
    let card = get_card(event)
    if (Date.parse(event.date) > Date.now() - one_day) {
      $('#upcoming').append(card)
    } else {
      $('#passed').append(card)
    }
  })
}