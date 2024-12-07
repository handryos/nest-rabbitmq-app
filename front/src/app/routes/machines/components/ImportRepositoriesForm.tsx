import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import { useState } from "react";
import {
  Grid,
  IconButton,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Iconify from "@/app/components/Iconify/Iconify";
import FormCard from "@/app/components/FormCard/FormCard";
import { useForm } from "react-hook-form";
import RepositoryService from "@/app/services/Repository/RepositoryService";
import { useRouter } from "next/navigation";
import { Repository } from "@/app/types/Repository";
import FormProvider from "@/app/components/FormProvider/FormProvider";

export default function CsvImport() {
  const [csvData, setCsvData] = useState<any[]>([]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => handleFileUpload(acceptedFiles),
  });

  const router = useRouter();

  const handleFileUpload = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      Papa.parse(file, {
        complete: (result) => {
          setCsvData(result.data);
        },
        header: true,
      });
    }
  };

  const handleDelete = (index: number) => {
    setCsvData((prevData) => prevData.filter((_, i) => i !== index));
  };

  const defaultValues = {
    repositories: [],
  };

  const methods = useForm({
    mode: "onBlur",
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = async (data: any) => {
    const repositories: Repository[] = csvData.map((row) => ({
      name: row["Repository Name"],
      owner: row["Owner"],
      stars: parseInt(row["Stars"], 10) || 0,
    }));
    try {
      const post = await RepositoryService.save(repositories);
      if (post.status === 201 || post.status === 200)
        router.push("/routes/repositories");
    } catch (error) {
      console.error("Error in register", error);
    }
  };

  return (
    <FormCard
      functionConfirm={handleSubmit(onSubmit)}
      topContent="Export Repository"
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
          {/* Drag and Drop */}
          <Grid spacing={2} mb={2} item xs={3}>
            <Paper
              {...getRootProps()}
              sx={{
                width: 300,
                height: 150,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: "2px solid #1976d2",
                cursor: "pointer",
              }}
            >
              <input {...getInputProps()} />
              <Typography variant="body2">
                Drag and drop the CSV file here
              </Typography>
            </Paper>
          </Grid>

          {/* Table */}
          <Grid
            mt={2}
            p={1}
            bgcolor={"transparent"}
            boxShadow={"none"}
            item
            xs={12}
          >
            <Paper
              elevation={2}
              sx={{ overflow: "auto", height: "60dvh", pb: 2, p: 2 }}
            >
              <Typography variant="h6" ml={2} mb={2}>
                Imported Data
              </Typography>
              <TableContainer
                sx={{
                  overflowY: "auto",
                  overflowX: "auto",
                  maxHeight: "90%",
                }}
              >
                <Table>
                  <TableHead sx={{ p: 2 }}>
                    <TableRow>
                      <TableCell>Actions</TableCell>
                      <TableCell>Repository Name</TableCell>
                      <TableCell>Owner</TableCell>
                      <TableCell>Stars</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {csvData.map((row: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>
                          <IconButton
                            onClick={() => handleDelete(index)}
                            color="error"
                          >
                            <Iconify icon="mdi:delete" />
                          </IconButton>
                        </TableCell>
                        <TableCell sx={{ padding: "4px" }}>
                          {row["Repository Name"]}
                        </TableCell>
                        <TableCell>{row["Owner"]}</TableCell>
                        <TableCell>{row["Stars"]}</TableCell>
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
