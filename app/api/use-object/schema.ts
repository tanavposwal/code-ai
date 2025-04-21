import { z } from "zod";

// define a schema for the notifications
export const coderSchema = z.object({
  coder: z.array(
    z.object({
      explaination: z.string().describe("The explaination of the code."),
      code: z.string().describe("The code written by coder."),
    })
  ),
});
