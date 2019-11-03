import { Vacation } from "../models/vacation";
import { User } from "../models/user";

export class AppState {
    public vacations: Vacation[] = [];
    public users: User[] = [];
    public logged: any = "";
}