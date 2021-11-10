function load_events(elem_id, events) {
  let elem = document.getElementById(elem_id)
  events.forEach(event => {
    $(
     `<div class="card deep-orange">
        <div class="card-image">
          <a href="${event.link}" class="TODO"><img src="${event.image}"></a>
        </div>
        <div class="card-content white-text">
          <span class="card-title">${event.name}</span>
          <p>${event.desc}</p>
        </div>
      </div>`
    ).appendTo(elem)
  })
}

// Demo
load_events('upcoming', Array.from({length: 5}, () => ({
  link: '#',
  image: `https://picsum.photos/seed/${Math.floor(Math.random()*10000)}/500`,
  name: 'Something Coming Up',
  desc: 'Some details, maybe a <a href="#" class="TODO">link</a> or something?'
})))

load_events('passed', Array.from({length: 20}, () => ({
  link: '#',
  image: `https://picsum.photos/seed/${Math.floor(Math.random()*10000)}/500`,
  name: 'Something That Happend',
  desc: 'Some <a href="#" class="TODO">links</a> for videos or something?'
})))
