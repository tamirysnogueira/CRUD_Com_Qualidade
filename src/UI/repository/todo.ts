interface TodoControllerGetParams {
    page: number;
    limit: number;
}

interface TodoRepositoryGetOutput {
    todos: Todo[];
    total: number;
    pages: number;
}

function get({
    page,
    limit,
}: TodoControllerGetParams): Promise<TodoRepositoryGetOutput> {
    return fetch("/api/todos").then(async (resServerOfTodos) => {
        const todosString = await resServerOfTodos.text();
        const todosFromServer = JSON.parse(todosString).todos;

        const allTodos = todosFromServer;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedTodos = allTodos.slice(startIndex, endIndex);
        const totalPages = Math.ceil(allTodos.length / limit);

        return {
            todos: allTodos,
            total: totalPages,
            pages: paginatedTodos,
        };
    });
}

export const todoRepository = {
    get,
};

//Model
interface Todo {
    id: string;
    content: string;
    date: Date;
    done: boolean;
}

//Como em nossa aplicação pode ter mais de um lugar onde pode chamar o fetch
//quebramos ele em um repository para ficar acessível e organizado em outras
//partes do código
