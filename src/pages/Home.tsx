import MaintenanceForm from "../components/MaintenanceForm";
import {
  createMaintenanceRequest,
  CreateMaintenanceRequestPayload,
} from "../services/maintenanceRequestService";

const Home = () => {
  const handleSubmit = async (values: CreateMaintenanceRequestPayload) => {
    await createMaintenanceRequest(values);
  };

  return <MaintenanceForm onSubmit={handleSubmit} />;
};

export default Home;
