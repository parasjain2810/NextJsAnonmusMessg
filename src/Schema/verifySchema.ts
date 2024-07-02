import { z } from "zod";

export const verifySchema= z.object({
    code:z.string().length(6,{message:"Validation code must be 6 digits"})
})