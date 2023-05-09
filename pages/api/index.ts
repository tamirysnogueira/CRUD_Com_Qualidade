import { NextApiRequest, NextApiResponse } from "next";

export default function Api(req: NextApiRequest, res: NextApiResponse) {
    res.status(200).json({
        message: "Hello, this a server-side",
    });
}
