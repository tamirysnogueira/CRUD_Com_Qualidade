import { todoRepository } from "@server/repository/todo";
import { NextApiRequest, NextApiResponse } from "next";

function get(req: NextApiRequest, res: NextApiResponse) {
    const query = req.query;
    const page = Number(query.page);
    const limit = Number(query.limit);

    //Verificando se está passando as querys para acessar os
    //dados no banco
    if (query.page && isNaN(page)) {
        res.status(400).json({
            error: {
                message: "`page` must be a number",
            },
        });

        return;
    }

    if (query.limit && isNaN(limit)) {
        res.status(400).json({
            error: {
                message: "`limit` must be a number",
            },
        });

        return;
    }

    const { todos, total, pages } = todoRepository.get({
        page,
        limit,
    });

    res.status(200).json({
        todos,
        total,
        pages,
    });
}

export const todoController = {
    get,
};
