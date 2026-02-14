// utils/statusTransitions.js

import { STATUS } from "./constants.js";

export const allowedTransitions = {
    [STATUS.PENDING]: [STATUS.APPROVED],

    [STATUS.APPROVED]: [STATUS.ASSIGNED],

    [STATUS.ASSIGNED]: [STATUS.IN_PROGRESS],

    [STATUS.IN_PROGRESS]: [STATUS.COMPLETED],

    [STATUS.COMPLETED]: [STATUS.CLOSED],

    [STATUS.CLOSED]: []
};