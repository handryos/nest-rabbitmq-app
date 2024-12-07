import React, { useState } from "react";
import {
  Autocomplete,
  TextField,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import axios from "axios";
import RepositoryService from "@/app/services/Repository/RepositoryService";
import MainTextField from "../TextField/TextField";
import { getUserRepositories } from "@/app/redux/slices/Repositories";
import { dispatch } from "@/app/redux/store";

export type IProps = {
  name: string;
  label?: string;
  gridProps?: any;
  required?: boolean;
};

const MainAutoComplete = ({
  name,
  label,
  gridProps,
  required = false,
}: IProps) => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<string[]>([]);
  const { control } = useFormContext();

  const searchUsers = async (query: string) => {
    if (query?.length > 0) {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://api.github.com/search/users?q=${query}`
        );
        const usernames = response.data.items.map((user: any) => user.login);
        setUsers(usernames);
      } catch (error) {
        console.error("Error fetching users from GitHub", error);
      } finally {
        setLoading(false);
      }
    } else {
      setUsers([]);
    }
  };

  return (
    <Grid item {...gridProps}>
      <Stack sx={{ width: "100%" }}>
        <Controller
          name={name}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Autocomplete
              {...field}
              id={name}
              style={{ width: "100%" }}
              renderInput={(params) => (
                <MainTextField
                  requerido
                  name=""
                  {...params}
                  label={label}
                  error={!!error}
                  helperText={error?.message}
                  required={required}
                  onInput={(e: any) => {
                    const query = e.target.value;
                    searchUsers(query);
                  }}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: params.InputProps.startAdornment,
                  }}
                />
              )}
              options={users}
              loading={loading}
              getOptionLabel={(option) => option}
              onChange={(e, data) => {
                field.onChange(data);
                if (data != null) dispatch(getUserRepositories(data));
              }}
              loadingText="Loading users..."
              noOptionsText="No users found"
              renderOption={(props, option) => (
                <li {...props}>
                  <Typography variant="body1">{option}</Typography>
                </li>
              )}
            />
          )}
        />
      </Stack>
    </Grid>
  );
};

export default MainAutoComplete;
