import {EHandler, Handler} from "../utils/types";

const VERSION = process.env.VERSION || "unknown";

const about: Handler = (_, res) => {
    res.send(`UPTO API v${VERSION}`);
};

export default about as EHandler
