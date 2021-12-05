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

// Generates a google calendar link
function get_google_calendar(event) {
  function format_date(date, start, end) {
    let isof = dstr => new Date(dstr).toISOString().replace(/-|:|\./g, '')
    if (!date) return '#!'
    if (!start && !end)
      return isof(date).split('T')[0] + '/' + isof(Date.parse(date) + 24*60*60*1000).split('T')[0]
    return isof(date + ' ' + (start || '12:00 AM')) + '/' + isof(date + ' ' + (end || '11:59 PM'))
  }
  let params = {
    action: 'TEMPLATE',
    text: event.name || '',
    details: event.desc || '',
    location: event.address || event.location || '',
    trp: true,
    dates: format_date(event.date, event.start, event.end)
  }
  return 'https://calendar.google.com/calendar/render?' + $.param(params)
}

// Event Loader
function get_card(event) {
  return ejs.render(
   `<div class="card orange accent-2 event">
      <% if (event.image) { %>
        <div class="card-image">
          <% if (event.link || event.stream) { %> <a target="_blank" href="<%- event.link || event.stream %>"> <% } %>
            <img src="<%- event.image %>">
          <% if (event.link || event.stream) { %> </a> <% } %>
          <% if (event.id != 'preview') { %>
            <a id="<%- event.id %>" class="btn-floating halfway-fab super mod-event" href="#!">
              <i class="fas fa-pencil-alt"></i>
            </a>
          <% } %>
        </div>
      <% } %>
      <div class="card-content white-text">
        <span class="card-title">
          <% if (!event.image && event.link) { %> <a target="_blank" href="<%- event.link %>"> <% } %>
            <%- event.name %>
          <% if (!event.image && event.link) { %> </a> <% } %>
          <% if (!event.image && event.id != 'preview') { %>
            <a id="<%- event.id %>" class="btn-floating right super mod-event" href="#!">
              <i class="fas fa-pencil-alt"></i>
            </a>
          <% } %>
        </span>
        <% if (event.desc) { %>
          <%- md2html(event.desc).html() %>
        <% } %>
      </div>
      <div class="card-action">
        <a target="_blank" href="<%- get_google_calendar(event) %>" class="white-text"><i class="far fa-calendar-alt"></i> <%- event.date %></a>
        <% if (event.start || event.end) { %>
          <a target="_blank" href="<%- get_google_calendar(event) %>" class="white-text">
            <i class="far fa-clock"></i>
            <%- event.start ? event.start : 'till ' %><%- event.end ? (event.start ? ' - ' + event.end : event.end) : '' %>
          </a>
        <% } %>
        <% if (event.location || event.address) { %>
          <a target="_blank" href="https://www.google.com/maps/search/?api=1&query=<%- encodeURI(event.address || event.location) %>" class="white-text">
            <i class="fas fa-map-marker-alt"></i> <%- event.location || event.address %>
          </a>
        <% } %>
        <% if (event.stream) { %>
          <a target="_blank" href="<%- event.stream %>" class="white-text"><i class="fas fa-video"></i> Stream</a>
        <% } %>
      </div>
    </div>`, {event: event}
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