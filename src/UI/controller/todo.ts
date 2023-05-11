import { todoRepository } from "@ui/repository/todo";

interface TodoControllerGetParams {
    page?: number; //page não é obrigatória
}

function get({ page }: TodoControllerGetParams = {}) {
    return todoRepository.get({
        page: page || 1,
        limit: 10,
    });
}

export const todoController = {
    get,
};
