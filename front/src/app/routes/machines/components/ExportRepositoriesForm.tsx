"use client";

import FormCard from "@/app/components/FormCard/FormCard";
import FormProvider from "@/app/components/FormProvider/FormProvider";
import Iconify from "@/app/components/Iconify/Iconify";
import MainSelect from "@/app/components/Select/MainSelect";
import MainTextField from "@/app/components/TextField/TextField";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Grid,
  MenuItem,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "@/app/redux/store";
import { Repository } from "@/app/types/Repository";
import RepositoryService from "@/app/services/Repository/RepositoryService";
import MainAutoComplete from "@/app/components/AutoComplete/MainAutoComplete";
import { Paper } from "@mui/material";

export default function RepositoriesForm({ type }: { type: string }) {
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("This field is required"),
    type: Yup.string().required("This field is required"),
  });

  const router = useRouter();
  const id = usePathname().split("/").slice(-1)[0];

  const repositoryData = useSelector((state) => state.repositories.repository);
  const userRepositories = useSelector(
    (state) => state.repositories.userRepositories
  );

  let defaultValues = {
    name: "",
    owner: "",
    stars: 0,
  };
  const methods = useForm({
    resolver: yupResolver(validationSchema) as any,
    mode: "onBlur",
    defaultValues: defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    reset,
    getValues,
    formState: { errors },
  } = methods;

  const [userRepos, setUserRepos] = useState<Repository[]>([]);

  useEffect(() => {
    setUserRepos(userRepositories);
  }, [userRepositories]);

  useEffect(() => {
    if (type == "update" && repositoryData) {
      setValue("name", repositoryData.name);
      setValue("owner", repositoryData.owner);
      setValue("stars", repositoryData.stars);
    }
  }, [repositoryData]);

  const onSubmit = async (data: Repository) => {
    let repository: Repository = {
      name: data.name,
      owner: data.owner,
      stars: data.stars,
    };
    try {
      let post =
        type == "new"
          ? await RepositoryService.save(repository)
          : await RepositoryService.update(Number(id), repository);
      if (post.status == 201 || post.status == 200)
        router.push("/routes/repositories");
    } catch (error) {
      console.error("Error in register", error);
    }
  };

  const handleDeleteRepository = (repoName: string) => {
    setUserRepos((prev) => prev.filter((repo) => repo.name !== repoName));
  };

  const exportToCSV = () => {
    const headers = ["Repository Name", "Owner", "Stars"];
    const rows = userRepos.map((repo: any) => [
      repo.name,
      repo.owner.login,
      repo.stargazers_count,
    ]);

    let csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n";

    rows.forEach((row) => {
      csvContent += row.join(",") + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "repositories.csv");
    document.body.appendChild(link);
    link.click();
  };

  const theme = useTheme();

  return (
    <FormCard
      functionConfirm={handleSubmit(onSubmit)}
      topContent="Export Repository"
      removeConfirm
    >
      <FormProvider methods={methods}>
        <Grid
          xs={12}
          container
          height={{ xl: "50dvh", md: "50dvh" }}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Grid spacing={2} mb={2} item xs={6}>
            <Grid
              item
              xs={12}
              mb={2}
              container
              justifyContent="center"
              alignItems="center"
            >
              <Iconify fontSize={62} icon="mdi:github" />
            </Grid>

            <MainAutoComplete
              name="githubUser"
              label="Search GitHub User"
              required={true}
              gridProps={{ xs: 12 }}
            />
          </Grid>
          <Grid item xs={12} mt={2} container justifyContent="center">
            <IconButton
              sx={{ ":hover": { bgcolor: "transparent" } }}
              onClick={exportToCSV}
              color="primary"
            >
              <Iconify
                color={theme.palette.primary.main}
                icon="mdi:file-csv"
                fontSize={30}
              />
              <Typography variant="body2" ml={1}>
                Export to CSV
              </Typography>
            </IconButton>
          </Grid>
          <Grid
            mt={2}
            p={1}
            bgcolor={"transparent"}
            boxShadow={"none"}
            item
            xs={12}
          >
            <Paper elevation={2} sx={{ height: "52dvh", pb: 2 }}>
              <TableContainer sx={{ overflowX: "auto", maxHeight: "100%" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Actions</TableCell>
                      <TableCell>Repository Name</TableCell>
                      <TableCell>Stars</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {userRepos.map((repo: any) => (
                      <TableRow key={repo.name}>
                        <TableCell>
                          <IconButton
                            onClick={() => handleDeleteRepository(repo.name)}
                            color="error"
                          >
                            <Iconify icon={"mdi:delete"} />
                          </IconButton>
                        </TableCell>
                        <TableCell>{repo.name}</TableCell>
                        <TableCell>{repo.stargazers_count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </FormProvider>
    </FormCard>
  );
}
