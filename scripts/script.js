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

// Read Images as they get uploaded
$('.event-image-upload').change(async function (e) {
  toast('Loading Image...')
  let image = await read_image(this.files[0] || '')
  if (image) if (image.length < 10**6) {
    $(this).parent().find('.event-image-data').val(image).trigger('change')
    succ('Image loaded')
  } else {
    fail('Image too big (greater than 1 mb)')
  }
})

// For filling forms
function prefill(form, data) {
  Object.entries(data).forEach(([input_name, value]) => {
    $(form).find(`textarea[name=${input_name}],input[name=${input_name}]:not([type=file])`).val(value).trigger('change')
    $(form).find(`label[for=${input_name}]`).addClass('active')
  })
}

// Event Loader
function get_card(event) {
  return ejs.render(
   `<div class="card orange accent-2 event">
      <% if (image) { %>
        <div class="card-image">
          <% if (link || stream) { %> <a target="_blank" href="<%- link || stream %>"> <% } %>
            <img src="<%- image %>">
          <% if (link || stream) { %> </a> <% } %>
          <% if (id != 'preview') { %>
            <a id=<%- id %> class="btn-floating halfway-fab super mod-event" href="#!">
              <i class="fas fa-pencil-alt"></i>
            </a>
          <% } %>
        </div>
      <% } %>
      <div class="card-content white-text">
        <span class="card-title">
          <% if (!image && link) { %> <a target="_blank" href="<%- link %>"> <% } %>
            <%- name %>
          <% if (!image && link) { %> </a> <% } %>
          <% if (!image && id != 'preview') { %>
            <a id=<%- id %> class="btn-floating right super mod-event" href="#!">
              <i class="fas fa-pencil-alt"></i>
            </a>
          <% } %>
        </span>
        <% if (desc) { %>
          <%- md2html(desc).html() %>
        <% } %>
      </div>
      <div class="card-action">
        <a href="#!" class="white-text"><i class="far fa-calendar-alt"></i> <%- date %></a>
        <% if (start || end) { %>
          <a href="#!" class="white-text">
            <i class="far fa-clock"></i>
            <%- start ? start : 'till ' %><%- end ? (start ? ' - ' + end : end) : '' %>
          </a>
        <% } %>
        <% if (location || address) { %>
          <a target="_blank" href="https://www.google.com/maps/search/?api=1&query=<%- encodeURI(address || location) %>" class="white-text">
            <i class="fas fa-map-marker-alt"></i> <%- location || address %>
          </a>
        <% } %>
        <% if (stream) { %>
          <a target="_blank" href="<%- stream %>" class="white-text"><i class="fas fa-video"></i> Stream</a>
        <% } %>
      </div>
    </div>`, Object.assign({
      // This is to prevent undefined errors for optional events - add any future optional events here
      desc: false,
      link: false,
      image: false,
      location: false,
      address: false,
      stream: false,
      start: false,
      end: false,
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