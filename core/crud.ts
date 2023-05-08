import fs from 'fs'
import {v4 as uuid} from 'uuid'

const DB_FILE_PATH = './core/db'

console.log('[CRUD]')

type UUID = String

// nas interfaces podemos definir quais propriedades nosso tipo deve ter,
//no caso do tipo Todo, é obrigatório date, content e done. Se chama tipagem

interface Todo {
    id: UUID,
    date: String,
    content: String,
    done: boolean
}

function create(content: string): Todo { //create irá retornar uma Todo
    const todo: Todo = {
        id: uuid(),
        date: new Date().toISOString(),
        content,
        done: false
    }

    const todos: Array<Todo> = [ //Diamond Operator
        ...read(),
        todo
    ]

    //salvar no sistema
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify({
        todos

    }, null, 2))

    return todo
}

// read retorna o tipo de um array das todos: Array<Todo>
function read(): Array<Todo> {
    const dbString = fs.readFileSync(DB_FILE_PATH, 'utf-8')
    const db = JSON.parse(dbString || '{}')

    if(!db.todos) { //fast fail validation
        return []
    }

    return db.todos
}

function update(id: UUID, partialTodo: Partial<Todo>): Todo { //Partial significa que pode ou não ter algum valor de todo
    let updateTodo
    const todos = read()

    todos.forEach((currentTodo)=> {
        const isToUpdate = currentTodo.id === id

        if(isToUpdate) {
            updateTodo = Object.assign(currentTodo, partialTodo) //O Object.assign está copiando as propriedades da partialTodo para a currentTodo
        }
    })

    fs.writeFileSync(DB_FILE_PATH, JSON.stringify({
        todos
    }, null, 2))

    if(!updateTodo){
        throw new Error("Please, provide another id")
    }

    return updateTodo
}

function updateContentById(id: UUID, content: String):Todo {
    return update(id, {
        content,
        done: true
    })
}

function deleteById(id: UUID) {
    const todos = read()

    const todosWithoutOne = todos.filter((todo)=> {
        if(id === todo.id) {
            return false
        }

        return true
    })

    fs.writeFileSync(DB_FILE_PATH, JSON.stringify({
        todos: todosWithoutOne
    }, null, 2))

}

function CLEAR_DB() {
    fs.writeFileSync(DB_FILE_PATH, "")
}

// [SIMULATION]

CLEAR_DB()
create("Primeira TODO")

const secondTodo = create("Segunda TODO")
deleteById(secondTodo.id)

const terceiraTodo = create("Terceira TODO")
updateContentById(terceiraTodo.id, "Atualizada!")

console.log(read())
