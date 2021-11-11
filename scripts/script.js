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
  // TODO: Neatify the Spahgettios
  events.forEach(event => {
    // `<div class="card orange accent-2 event">
    //   <div class="card-image">
    //     <a href="${event.link}"><img src="${event.image}"></a>
    //     <a id=${event.id} class="btn-floating halfway-fab red delete-event super" href="#!"><i class="far fa-trash-alt"></i></a>
    //   </div>
    //   <div class="card-content white-text">
    //     <span class="card-title">${event.name}</span>
    //     <p>${event.desc}</p>
    //     <p class="right">${event.date}</p>
    //   </div>
    // </div>`
    let card = $('<div></div>').addClass('card orange accent-2 event')
    let icon = $('<i></i>').addClass('far fa-trash-alt')
    let fab = $('<a></a>').attr({id: event.id, href: '#!'}).addClass('btn-floating halfway-fab red delete-event super')
    fab.append(icon)
    if (event.image) {
      let card_image = $('<div></div>').addClass('card-image')
      let image = $('<img></img>').attr({src: event.image})
      card_image.append(fab)
      if (event.link) {
        let link = $('<a></a>').attr({href: event.link})
        card_image.append(link.append(image))
      } else {
        card_image.append(image)
      }
      card.append(card_image)
    }
    let card_content = $('<div></div>').addClass('card-content white-text')
    let title = $('<span></span>').addClass('card-title').text(event.name)
    if (!event.image && event.link) {
      let link = $('<a></a>').attr({href: event.link})
      card_content.append(link.append(title))
    } else {
      card_content.append(title)
    }
    let date = $('<p></p>').addClass('right').text(event.date)
    if (event.desc) {
      let desc = $('<p></p>').text(event.desc)
      card_content.append(desc)
    } else {
      date.removeClass('right')
    }
    card_content.append(date)
    card.append(card_content)
    if (!event.image) {
      fab.removeClass('halfway-fab').addClass('right')
      title.append(fab)
    }
    card.appendTo(elem)
  })
}