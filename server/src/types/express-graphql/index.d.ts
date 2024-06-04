import {Options} from "express-graphql";

declare global {}
    interface Options {
      isAuth?: boolean
      user?: Record<string,any>
    }
}