"use client";

import FormCard from "@/app/components/FormCard/FormCard";
import FormProvider from "@/app/components/FormProvider/FormProvider";
import Iconify from "@/app/components/Iconify/Iconify";
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
import MainTextField from "@/app/components/TextField/TextField";

export default function ExportRepositoriesForm() {
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("This field is required"),
    owner: Yup.string().required("This field is required"),
    stars: Yup.number().required("This field is required"),
  });

  const router = useRouter();
  const id = usePathname().split("/").slice(-1)[0];

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
    formState: { errors },
  } = methods;

  useEffect(() => {
    RepositoryService.getRepositoryById(Number(id)).then((res) => {
      console.log(res);
      setValue("name", res.data.repo.name);
      setValue("owner", res.data.repo.owner);
      setValue("stars", res.data.repo.stars);
    });
  }, []);

  const onSubmit = async (data: Repository) => {
    let repository: Repository = {
      name: data.name,
      owner: data.owner,
      stars: data.stars,
    };
    try {
      let post = await RepositoryService.update(Number(id), repository);
      if (post.status == 201 || post.status == 200)
        router.push("/routes/repositories");
    } catch (error) {
      console.error("Error in register", error);
    }
  };

  return (
    <FormCard
      functionConfirm={handleSubmit(onSubmit)}
      topContent="Edit Repository"
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

            <MainTextField
              sx={{ mb: 2 }}
              label={"Name"}
              requerido
              name="name"
            />
            <MainTextField
              sx={{ mb: 2 }}
              label={"Stars"}
              requerido
              name="stars"
            />
            <MainTextField
              sx={{ mb: 2 }}
              label={"Owner"}
              requerido
              name="owner"
            />
          </Grid>
        </Grid>
      </FormProvider>
    </FormCard>
  );
}
