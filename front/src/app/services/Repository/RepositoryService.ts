import AppAxios from "@/app/axios/AppAxios";
import GitHubAxios from "@/app/axios/GitHubAxios";
import { Repository } from "@/app/types/Repository";
import { toast } from "react-toastify";

export default {
  async getAllRepositories() {
    return AppAxios()
      .get("")
      .then((response) => {
        return response;
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        return error.response;
      });
  },

  async getUserRepositories(user: string) {
    return GitHubAxios(user)
      .get("")
      .then((response) => {
        return response;
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        return error.response;
      });
  },

  async getRepositoryById(id: number) {
    return AppAxios()
      .get(`/${id}`)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        return error.response;
      });
  },

  async save(repository: Repository[]) {
    return AppAxios()
      .post("", repository)
      .then((Response) => {
        if (Response.status === 201) {
          toast.success("Repository created successfully");
        }
        return Response;
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        return error.response;
      });
  },
  async update(id: number, repository: Repository) {
    return AppAxios()
      .put(`/${id}`, {
        name: repository.name,
        owner: repository.owner,
        stars: repository.stars,
      })
      .then((Response) => {
        if (Response.status === 200) {
          toast.success("Repository updated successfully");
        }
        return Response;
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        return error.response;
      });
  },
  async delete(name: string) {
    return AppAxios()
      .delete(`/${name}`)
      .then((Response) => {
        if (Response.status === 200) {
          toast.success("Repository deleted successfully");
        }
        return Response;
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        return error.response;
      });
  },
};
