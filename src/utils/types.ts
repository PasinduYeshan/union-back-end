import {Response as EResponse, Request as ERequest, NextFunction} from "express";
import {ResponseBuilder} from "./resp/res-builder";

export interface Request extends ERequest {
    user: {
        userId: string,
        username : string,
        accountType: string,
        name : string
        email: string,
    },
    fileValidationError?: string,
}

export interface Response extends EResponse {
    r: ResponseBuilder
}

export interface Log {
    userId: string,
    name: string,
    time : Date,
}

export type Handler = (req: Request, res: Response, next: NextFunction) => void

export {Response as EResponse} from "express"
export {Request as ERequest} from "express"
export {Handler as EHandler} from "express"
