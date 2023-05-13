//Repository certifica que todos os dados estão vindo corretos
//Como em nossa aplicação pode ter mais de um lugar onde pode chamar o fetch
//quebramos ele em um repository para ficar acessível e organizado em outras
//partes do código

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
        const todosFromServer = parseTodosFromServer(
            JSON.parse(todosString)
        ).todos; // para não retornar valores de tipos desconhecidos, cria-se essa função para validar os tipos

        const allTodos = todosFromServer;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedTodos = allTodos.slice(startIndex, endIndex);
        const totalPages = Math.ceil(allTodos.length / limit);

        return {
            todos: paginatedTodos,
            total: allTodos.length,
            pages: totalPages,
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

function parseTodosFromServer(responseBody: unknown): { todos: Array<Todo> } {
    if (
        responseBody !== null &&
        typeof responseBody === "object" &&
        "todos" in responseBody &&
        Array.isArray(responseBody.todos)
    ) {
        return {
            todos: responseBody.todos.map((todo: unknown) => {
                if (todo === null && typeof todo !== "object") {
                    throw new Error("Invalid todo from API");
                }

                const { id, content, done, date } = todo as {
                    id: string;
                    content: string;
                    date: string;
                    done: string;
                };

                return {
                    id,
                    content,
                    date: new Date(date),
                    done: String(done).toLowerCase() === "true", //coloca-se como String para evitar bug, pois quando o false vem como string, ele retorna true
                };
            }),
        };
    }

    return {
        todos: [],
    };
}
