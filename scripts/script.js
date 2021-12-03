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
  var elem = $('<div></div>').html(converter.makeHtml(md))
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
          <% if (link || stream) { %> <a href="<%- link || stream %>"> <% } %>
            <img src="<%- image %>">
          <% if (link || stream) { %> </a> <% } %>
          <% if (id != 'preview') { %>
            <a id=<%- id %> class="btn-floating halfway-fab red delete-event super" href="#!">
              <i class="far fa-trash-alt"></i>
            </a>
          <% } %>
        </div>
      <% } %>
      <div class="card-content white-text">
        <span class="card-title">
          <% if (!image && link) { %> <a href="<%- link %>"> <% } %>
            <%- name %>
          <% if (!image && link) { %> </a> <% } %>
          <% if (!image && id != 'preview') { %>
            <a id=<%- id %> class="btn-floating right red delete-event super" href="#!">
              <i class="far fa-trash-alt"></i>
            </a>
          <% } %>
        </span>
        <% if (desc) { %>
          <%- md2html(desc).html() %>
        <% } %>
      </div>
      <div class="card-action">
        <a href="#" class="white-text"><i class="far fa-clock"></i> <%- date %></a>
        <% if (location || address) { %>
          <a href="https://www.google.com/maps/search/?api=1&query=<%- encodeURI(address || location) %>" class="white-text"><i class="fas fa-map-marker-alt"></i> <%- location || address %></a>
        <% } %>
        <% if (stream) { %>
          <a href="<%- stream %>" class="white-text"><i class="fas fa-video"></i> Stream</a>
        <% } %>
      </div>
    </div>`, Object.assign({
      // This is to prevent undefined errors for optional events - add any future optional events here
      desc: false,
      link: false,
      image: false,
      location: false,
      address: false,
      stream: false
    }, event)
  )
}

const one_day = 24*60*60*1000
function load_events(events) {
  events.forEach(event => {
    let card = get_card(event)
    if (Date.parse(event.date) > Date.now() - one_day) {
      $('#upcoming').append(card)
    } else {
      $('#passed').append(card)
    }
  })
}

let test_events = ['', 'This is a description'].flatMap(desc =>
  ['', 'https://www.youtube.com/channel/UCyrHmRu2x_7-2aKa5DVa0zw'].flatMap(link =>
    ['', 'https://picsum.photos/500'].map(image => 
      ({
        name: 'Example',
        date: 'Feb 21, 2077',
        desc: desc,
        link: link,
        image: image,
        location: 'Temple',
        address: 'ISKCON Atlanta',
        stream: 'https://www.facebook.com/KirtanAtlanta/',
        id: Math.floor(Math.random() * 500)
      })
    )
  )
)
load_events(test_events)