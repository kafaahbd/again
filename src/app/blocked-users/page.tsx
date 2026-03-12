import BlockedUsersPage from "../../views/BlockedUsersPage";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute>
      <BlockedUsersPage />
    </ProtectedRoute>
  );
}
