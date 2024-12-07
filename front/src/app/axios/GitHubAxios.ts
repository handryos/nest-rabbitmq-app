import axios from "axios";

export default function GitHubAxios(user: string) {
  return axios.create({
    baseURL: `https://api.github.com/users/${user}/repos`,
  });
}
