"use client";

import RepositoriesChart from "@/app/components/Charts/QuantityChart";
import StarsPieChart from "@/app/components/Charts/StarsChart";
import { getRepositories } from "@/app/redux/slices/Repositories";
import { dispatch, useSelector } from "@/app/redux/store";
import { Box, Grid, Theme, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";

export default function Page() {
  const repositories = useSelector((state) => state.repositories.repositories);
  let [repositoryState, setRepository] = useState<any[]>([]);

  console.log(repositoryState);
  useEffect(() => {
    dispatch(getRepositories());
  }, []);

  useEffect(() => {
    setRepository(repositories);
  }, [repositories]);

  return (
    <Box p={5}>
      <Grid display={"flex"} justifyContent={"center"} container spacing={2}>
        <Grid item xs={12} md={5}>
          <Box mb={5} sx={{ height: "37dvh" }}>
            <RepositoriesChart repositories={repositoryState.length} />
          </Box>
        </Grid>
        <Grid item xs={12} md={5}>
          <Box sx={{ height: "37dvh" }}>
            <StarsPieChart repos={repositoryState} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
