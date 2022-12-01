import type { PayloadAction } from "@reduxjs/toolkit";
import { ICompany } from "../../types";
import { CompaniesState } from "./slice";

const reducers = {
    setCompanies: (state: CompaniesState, action: PayloadAction<ICompany[]>) => {
        state.companies = action.payload && action.payload.length ? [...state.companies, ...action.payload] : [];
    },
    editCompany: (state: CompaniesState, action: PayloadAction<ICompany>) => {
        const company = state.companies.find(company => company.id === action.payload.id);

        if (company) {
            const indexOf = state.companies.indexOf(company);

            if (indexOf >= 0) {
                state.companies[indexOf] = action.payload;
            }
        }
    },
    addCompany: (state: CompaniesState, action: PayloadAction<ICompany>) => {
        state.companies.unshift(action.payload);
    },
    deleteCompany: (state: CompaniesState, action: PayloadAction<string>) => {
        const company = state.companies.find(company => company.id === action.payload);

        if (company) {
            const indexOf = state.companies.indexOf(company);

            if (indexOf >= 0) {
                state.companies.splice(indexOf, 1);
            }
        }
    },
    changeCheck: (state: CompaniesState, action: PayloadAction<{ id: string, isCheck: boolean }>) => {
        const company = state.companies.find(company => company.id === action.payload.id);

        if (company) {
            const indexOf = state.companies.indexOf(company);

            if (indexOf >= 0) {
                state.companies[indexOf]["check"] = action.payload.isCheck ? "is-checked" : "";
            }
        }
    },
    changeCount: (state: CompaniesState, action: PayloadAction<{ id: string; count: number }>) => {
        const company = state.companies.find(company => company.id === action.payload.id);

        if (company) {
            const indexOf = state.companies.indexOf(company);

            if (indexOf >= 0) {
                state.companies[indexOf]["count"] = state.companies[indexOf]["count"] + action.payload.count;
            }
        }
    },
};

export default reducers;