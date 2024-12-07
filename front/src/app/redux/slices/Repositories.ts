"use client";
import RepositoryService from "@/app/services/Repository/RepositoryService";
import { Repository } from "@/app/types/Repository";
/* eslint-disable react-hooks/rules-of-hooks */
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface InitialState {
  repositories: Repository[];
  repository: Repository;
  userRepositories: Repository[];
}

export const initialState: InitialState = {
  repositories: [],
  repository: { name: "", owner: "", stars: 0 },
  userRepositories: [],
};

const slice = createSlice({
  name: "reposReducer",
  initialState,
  reducers: {
    setUserRepositories: (state, action: PayloadAction<Repository[]>) => {
      state.userRepositories = action.payload;
    },
    setRepositories: (state, action: PayloadAction<Repository[]>) => {
      state.repositories = action.payload;
    },
    setRepository: (state, action: PayloadAction<Repository>) => {
      state.repository = action.payload;
    },
    reset: (state) => {
      state = initialState;
      return state;
    },
  },
});

export default slice.reducer;
export const { setRepositories, setRepository, setUserRepositories } =
  slice.actions;

export function getRepositories() {
  return async (dispatch: any) => {
    try {
      const response = await RepositoryService.getAllRepositories();
      if (response.status === 200) {
        console.log(response);
        dispatch(setRepositories(response.data.repositories.data));
      } else {
        throw new Error("Failed to get all repositories. Verify.");
      }
    } catch (error) {
      console.error("Error fetching repositories:", error);
    }
  };
}

export function getUserRepositories(user: string) {
  return async (dispatch: any) => {
    try {
      const response = await RepositoryService.getUserRepositories(user);

      if (response.status === 200) {
        dispatch(setUserRepositories(response.data));
      } else {
        throw new Error("Failed to get the repositories. Verify.");
      }
    } catch (error) {
      console.error("Error fetching repositories:", error);
    }
  };
}

export function getRepositoryById(id: number) {
  return async (dispatch: any) => {
    try {
      const response = await RepositoryService.getRepositoryById(id);
      if (response.status === 200) {
        dispatch(setRepository(response.repositories.data));
      } else {
        throw new Error("Failed to get repository. Verify.");
      }
    } catch (error) {
      console.error("Error fetching repository:", error);
    }
  };
}
