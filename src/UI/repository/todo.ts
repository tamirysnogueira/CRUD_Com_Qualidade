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
    return fetch(`/api/todos?page=${page}&limit=${limit}`).then(
        async (resServerOfTodos) => {
            const todosString = await resServerOfTodos.text();
            const responseParsed = parseTodosFromServer(
                JSON.parse(todosString)
            );

            return {
                todos: responseParsed.todos,
                total: responseParsed.total,
                pages: responseParsed.pages,
            };
        }
    );
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

// para não retornar valores de tipos desconhecidos, cria-se essa função para validar os tipos
function parseTodosFromServer(responseBody: unknown): {
    total: number;
    pages: number;
    todos: Array<Todo>;
} {
    if (
        responseBody !== null &&
        typeof responseBody === "object" &&
        "todos" in responseBody &&
        "total" in responseBody &&
        "pages" in responseBody &&
        Array.isArray(responseBody.todos)
    ) {
        return {
            total: Number(responseBody.total),
            pages: Number(responseBody.pages),
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
        pages: 1,
        total: 0,
        todos: [],
    };
}
