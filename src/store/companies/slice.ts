import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "..";
import { ICompany } from "../../types";
import reducers from "./reducers";

export interface CompaniesState {
    companies: ICompany[];
};

const initialState: CompaniesState = {
    companies: [],
};

export const companiesSlice = createSlice({
    name: "companies",
    initialState,
    reducers
});

export const selectCompaniesState = (state: RootState) => state.companies;

export const { setCompanies, editCompany, addCompany, deleteCompany, changeCheck, changeCount } = companiesSlice.actions;

export default companiesSlice.reducer;