const express = require('express')
const app = express();
const morgan = require('morgan');


/*
app.use(express.json());
*/
app.use(express.json());

// Custom token for logging request body
morgan.token('body', (req) => JSON.stringify(req.body));

app.use(

  morgan(function (tokens, req, res) {
    const requestBody = JSON.stringify(req.body);

    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      'Body:', tokens.body(req, res)
    ].join(' ')
  })
)

let notes = [
  {
    id: "11",
    content: "HTML is easy",
    important: true
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]


let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})


app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    const person = persons.find(person => person.id === id);
    
    response.json(person)
})

app.post('/api/persons', (request, response) => {

  const maxId = persons.length > 0 ? Math.max(...persons.map(n => Number(n.id))) : 0

  const person = request.body
  person.id = String(maxId + 1)

  persons = persons.concat(person)

  response.json(person)

  console.log(persons);

})


app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(note => note.id !== id)

    response.status(204).end()
})


app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
    const now = new Date();
    const formattedTime = now.toString();


    response.send(
            `<p>Phonebook has info for ${persons.length} people</p>
            <div>${formattedTime}</div>`
        )
})


app.post('/api/persons', (request, response) => {
    const person = request.body;

    if (!person || !person.name || !person.number) {
        return response.status(400).json({
            error: 'Name or number is missing'
        });
    }

    const maxId = persons.length > 0 ? Math.max(...persons.map(n => Number(n.id))) : 0;
    person.id = String(maxId + 1);

    persons = persons.concat(person);

    response.json(person);
});


app.get('/api/notes/:id', (request, response) => {
    const id = request.params.id
    const note = notes.find(note => note.id === id)
    
    if (note) {    
        response.json(note)  
    } else {    
        response.status(404).end()  
    }
})

app.delete('/api/notes/:id', (request, response) => {
    const id = request.params.id
    notes = notes.filter(note => note.id !== id)

    response.status(204).end()
})


app.post('/api/notes', (request, response) => {  
    /*
    const note = request.body  
    console.log(note)  
    response.json(note)
    */
    const maxId = notes.length > 0 ? Math.max(...notes.map(n => Number(n.id))) : 0

    const note = request.body
    note.id = String(maxId + 1)

    notes = notes.concat(note)

    response.json(note)
})


const PORT = 3001
    app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})