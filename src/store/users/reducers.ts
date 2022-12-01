import type { PayloadAction } from "@reduxjs/toolkit";
import { ICompany, IUser } from "../../types";
import { UsersState } from "./slice";

const reducers = {
    setUsers: (state: UsersState, action: PayloadAction<IUser[]>) => {
        state.users = action.payload && action.payload.length ? [...state.users, ...action.payload] : [];
    },
    editUser: (state: UsersState, action: PayloadAction<IUser>) => {
        const user = state.users.find(user => user.id === action.payload.id);

        if (user) {
            const indexOf = state.users.indexOf(user);

            if (indexOf >= 0) {
                state.users[indexOf] = action.payload;
            }
        }
    },
    addUser: (state: UsersState, action: PayloadAction<IUser>) => {
        state.users.unshift(action.payload);
    },
    deleteUser: (state: UsersState, action: PayloadAction<string>) => {
        const user = state.users.find(user => user.id === action.payload);

        if (user) {
            const indexOf = state.users.indexOf(user);

            if (indexOf >= 0) {
                state.users.splice(indexOf, 1);
            }
        }
    },
    changeCheck: (state: UsersState, action: PayloadAction<{ id: string, isCheck: boolean }>) => {
        const user = state.users.find(user => user.id === action.payload.id);

        if (user) {
            const indexOf = state.users.indexOf(user);

            if (indexOf >= 0) {
                state.users[indexOf]["check"] = action.payload.isCheck ? "is-checked" : "";
            }
        }
    },
    setCompany: (state: UsersState, action: PayloadAction<ICompany | null>) => {
        state.company = action.payload;
    }
};

export default reducers;