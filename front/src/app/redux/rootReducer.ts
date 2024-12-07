import { combineReducers } from "redux";
import Theme from "./slices/Theme";
import Repositories from "./slices/Repositories";

const rootReducer = combineReducers({
  theme: Theme,
  repositories: Repositories,
});

export { rootReducer };
