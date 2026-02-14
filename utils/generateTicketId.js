import { nanoid } from "nanoid";

const generateTicketId = () => {
    return `HTL-${new Date().getFullYear()}-${nanoid(6).toUpperCase()}`;
};

export default generateTicketId;