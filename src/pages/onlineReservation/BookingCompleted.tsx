import { Notification } from "@mantine/core";
import { BsCheckCircle, BsExclamationCircle } from "react-icons/bs";

interface BookingCompletedProps {
  isBookingConfirmed: boolean;
}

const BookingCompleted: React.FC<BookingCompletedProps> = ({
  isBookingConfirmed,
}) => {
  return isBookingConfirmed ? (
    <Notification
      icon={<BsCheckCircle />}
      color="green"
      title="¡Reserva enviada para confirmar!"
      radius="md"
    >
      Tu reserva ha sido enviada con éxito. Te confirmaremos la reserva vía whatsapp o email.
    </Notification>
  ) : (
    <Notification
      icon={<BsExclamationCircle />}
      color="red"
      title="Se enviará la solicitud de reserva"
      radius="md"
    >
      Asegúrate de completar todos los pasos antes de enviar la solicitud de reserva.
    </Notification>
  );
};

export default BookingCompleted;
