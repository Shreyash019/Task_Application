import { Request} from "express";

type UserObject = {
    id: string
}

interface UserRequest extends Request {
    user?: UserObject;
}

type DecodedJwt = {
    id: string;
  };

export { UserRequest, UserObject, DecodedJwt}