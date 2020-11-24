import { Timestamp } from "@firebase/firestore-types";

export interface InfonavitResponse {
    creditFromInfonavit?: number,
    housingSubAccountBalance?: number,
    operatingExpenses?: number,
    total?: number,
    name?: string,
    monthlySalaryDiscount?: number,
    error?: string,
    created_at?: Date | Timestamp,
    creditForEcotechnologies?: number
}