import { Box, Divider } from "@mantine/core";
import colors from "../../theme/colores";
import CreateUser from "./CreateUser";
import UserTable from "./UserTable";

const Dashboard = () => {
  return (
    <Box
      bg={colors.primaryBackground}
      p="lg"
      m="auto"
      style={{
        maxWidth: "1200px",
        width: "100%",
        padding: "1rem",
        "@media (maxWidth: 768px)": {
          padding: "0.5rem",
        },
      }}
    >
      <CreateUser />
      <Divider my="xl" />
      <UserTable />
    </Box>
  );
};

export default Dashboard;
