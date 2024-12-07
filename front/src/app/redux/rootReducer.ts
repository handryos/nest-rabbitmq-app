import { combineReducers } from "redux";
import Theme from "./slices/Theme";

const rootReducer = combineReducers({
  theme: Theme,
});

export { rootReducer };
