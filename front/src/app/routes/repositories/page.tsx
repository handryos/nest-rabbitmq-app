"use client";

import React, { useEffect, useState } from "react";
import { Grid, Theme, useMediaQuery } from "@mui/material";
import DataTable from "@/app/components/Grid/MainGrid";
import { dispatch, useSelector } from "@/app/redux/store";
import {
  getRepositoryById,
  getRepositories,
} from "@/app/redux/slices/Repositories";
import { useRouter } from "next/navigation";
import RepositoryService from "@/app/services/Repository/RepositoryService";

export default function Repositorys() {
  const isXs = useMediaQuery((theme: Theme) => theme.breakpoints.down("xs"));
  const isSm = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
  const isMd = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));
  const isLg = useMediaQuery((theme: Theme) => theme.breakpoints.down("lg"));
  const router = useRouter();

  const repositories = useSelector((state) => state.repositories.repositories);
  let [repositoryState, setRepository] = useState<any[]>([]);

  useEffect(() => {
    dispatch(getRepositories());
  }, []);

  useEffect(() => {
    setRepository(repositories);
  }, [repositories]);

  const handleRemove = (id: number) => {
    return setRepository((prev: any) => {
      return prev.filter((item: any) => item.id !== id);
    });
  };

  return (
    <>
      <Grid
        display={"flex"}
        alignItems={"center"}
        alignContent={"center"}
        alignSelf={"center"}
        justifyContent={"center"}
        container
        p={{ xs: 12, xl: 0, lg: 6 }}
        xs={12}
      >
        <Grid
          container
          sx={{
            height: "80vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Grid
            item
            xs={12}
            sm={11.9}
            md={11.8}
            xl={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <DataTable
              exportFunction={() => {
                router.push("repositories/export");
              }}
              removeCheckBox
              deleteFunction={(params) => {
                RepositoryService.delete(params.row.name).then((response) => {
                  if (response.status == 200) {
                    handleRemove(params.id);
                  }
                });
              }}
              newFunction={() => {
                router.push("repositories/new");
              }}
              editFunction={(params) => {
                router.push("repositories/edit/" + params.id);
                if (params && params.id) {
                  dispatch(getRepositoryById(Number(params.id)));
                }
              }}
              hidedColumns={[
                {
                  xs: ["id"],
                },
              ]}
              header={[
                {
                  field: "id",
                  headerName: "Id",
                  width: isXs
                    ? 120
                    : isSm
                    ? 100
                    : isMd
                    ? 100
                    : isLg
                    ? 100
                    : 200,
                },
                {
                  field: "name",
                  headerName: "Name",
                  width: isXs
                    ? 120
                    : isSm
                    ? 100
                    : isMd
                    ? 200
                    : isLg
                    ? 200
                    : 350,
                },
                {
                  field: "owner",
                  headerName: "Owner",
                  width: isXs
                    ? 120
                    : isSm
                    ? 200
                    : isMd
                    ? 200
                    : isLg
                    ? 200
                    : 350,
                },
                {
                  field: "stars",
                  headerName: "Stars",
                  width: isXs
                    ? 120
                    : isSm
                    ? 200
                    : isMd
                    ? 200
                    : isLg
                    ? 200
                    : 350,
                },
              ]}
              data={repositoryState}
            />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
