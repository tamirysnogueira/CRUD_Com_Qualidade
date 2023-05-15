import { todoRepository } from "@ui/repository/todo";

interface TodoControllerGetParams {
    page: number; //page não é obrigatória
}

function get(params: TodoControllerGetParams) {
    return todoRepository.get({
        page: params.page,
        limit: 2,
    });
}

function filterTodosByContent<Todo>(
    todos: Array<Todo & { content: string }>,
    search: string
): Todo[] {
    const homeTodos = todos.filter((todo) => {
        const searchNormalized = search.toLowerCase();
        const contentNormalized = todo.content.toLowerCase();
        return contentNormalized.includes(searchNormalized);
    });

    return homeTodos;
}

export const todoController = {
    get,
    filterTodosByContent,
};
