import React, { useState, useEffect } from "react";
import SearchUser from "./SearchUser.tsx";
import PlanInfo from "./PlanInfo.tsx";
import { Box } from "@mantine/core";
import { getUserByPhoneNumber } from "../../services/userService.tsx"; // Asegúrate de ajustar la importación según tu estructura de archivos
import { User as UserType } from "../../services/userService.tsx";

const PlanViewer: React.FC = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  // const [error, setError] = useState<string>('');

  // Efecto para verificar si hay un usuario guardado en el localStorage y actualizar su información
  useEffect(() => {
    const fetchUpdatedUser = async (phoneNumber: string) => {
      try {
        const updatedUser = (await getUserByPhoneNumber(
          phoneNumber
        )) as UserType;
        if (updatedUser) {
          const validUser = {
            ...updatedUser,
            servicesTaken: updatedUser.servicesTaken || 0,
            referralsMade: updatedUser.referralsMade || 0,
          };
          setUser(validUser);
          localStorage.setItem("savedUser", JSON.stringify(validUser));
        }
      } catch (err) {
        console.error("Error fetching updated user:", err);
      } finally {
        setLoading(false);
      }
    };

    const savedUser = localStorage.getItem("savedUser");
    if (savedUser) {
      const parsedUser: UserType = JSON.parse(savedUser);
      const validUser = {
        ...parsedUser,
        servicesTaken: parsedUser.servicesTaken || 0,
        referralsMade: parsedUser.referralsMade || 0,
      };
      setUser(validUser);
      fetchUpdatedUser(parsedUser.phoneNumber);
    } else {
      setLoading(false);
    }
  }, []);

  const handleUserFound = (user: UserType) => {
    const validUser = {
      ...user,
      servicesTaken: user.servicesTaken || 0,
      referralsMade: user.referralsMade || 0,
    };
    setUser(validUser);
    localStorage.setItem("savedUser", JSON.stringify(validUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.clear();
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <Box style={{ margin: "auto" }}>
      {!user ? (
        <SearchUser onUserFound={handleUserFound} />
      ) : (
        <PlanInfo user={user} onLogout={handleLogout} />
      )}
    </Box>
  );
};

export default PlanViewer;
