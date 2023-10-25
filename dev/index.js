import fabula from '../src'
fabula.create(lesta, '#root')
fetch('/form.json')
.then(res => res.json())
.then(entry => {
  fabula.init(entry)
})