import Mistakes from "../../views/Mistakes";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute>
      <Mistakes />
    </ProtectedRoute>
  );
}
