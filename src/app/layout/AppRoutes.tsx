import { Route, Routes } from "react-router-dom";
import HomePage from "../../features/home/HomePage";
import ProtectedRoute from "./PrivateRoute";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import ActivityDetails from "../../features/activities/details/ActivityDetails";
import ActivityForm from "../../features/activities/form/ActivityForm";
import NotFound from "../errors/ui/NotFound";
import RegisterSuccess from "../../features/users/RegisterSuccess";
import ConfirmEmail from "../../features/users/ConfirmEmail";
import ServerError from "../errors/ui/ServerError";
import TestErrors from "../errors/ui/TestError";
import ProfilePage from "../../features/profiles/layout/ProfilePage";

interface Props {
  location: any;
  isLoggedIn: boolean;
}

const AppRoutes = ({ location, isLoggedIn }: Props) => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/activities"
        element={
          <ProtectedRoute
            isAuthenticated={isLoggedIn}
            outlet={<ActivityDashboard />}
          />
        }
      />
      <Route path="/activities/:id" element={<ActivityDetails />} />
      <Route
        key={location.key}
        path="/createActivity"
        element={<ActivityForm />}
      />
      <Route
        key={location.key}
        path="/manage/:id"
        element={
          <ProtectedRoute
            isAuthenticated={isLoggedIn}
            outlet={<ActivityForm />}
          />
        }
      />
      <Route path="/errors" element={<TestErrors />} />
      <Route path="/server-error" element={<ServerError />} />
      <Route path="/account/registerSuccess" element={<RegisterSuccess />} />
      <Route path="/account/verifyEmail" element={<ConfirmEmail />} />
      <Route path="/profiles/:username" element={<ProfilePage />} />
      <Route path="not-found" element={<NotFound />} />
      <Route element={<NotFound />} /> */
    </Routes>
  );
};

export default AppRoutes;
