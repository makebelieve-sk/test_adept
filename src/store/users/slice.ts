import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "..";
import { ICompany, IUser } from "../../types";
import reducers from "./reducers";

export interface UsersState {
    users: IUser[];
    company: ICompany | null;
};

const initialState: UsersState = {
    users: [],
    company: null,
};

export const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers
});

export const selectUsersState = (state: RootState) => state.users;

export const { setUsers, editUser, addUser, deleteUser, changeCheck, setCompany } = usersSlice.actions;

export default usersSlice.reducer;