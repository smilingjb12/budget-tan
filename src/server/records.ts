import { createServerFn } from "@tanstack/react-start";
import {
  RecordService,
  createOrUpdateRecordSchema,
} from "~/services/record-service";
import { Month } from "~/lib/routes";
import { z } from "zod";
import { authMiddleware } from "~/middleware/auth";

const monthSummarySchema = z.object({
  year: z.number().int().min(1900).max(3000),
  month: z.number().int().min(1).max(12) as z.ZodSchema<Month>,
});

export const getMonthSummary = createServerFn({
  method: "GET",
})
  .inputValidator(monthSummarySchema)
  .middleware([authMiddleware])
  .handler(async ({ data: { year, month } }) => {
    return await RecordService.getMonthSummary(year, month);
  });

export const getAllTimeSummary = createServerFn({
  method: "GET",
})
  .middleware([authMiddleware])
  .handler(async () => {
    return await RecordService.getAllTimeSummary();
  });

export const getRecordsByMonth = createServerFn({
  method: "GET",
})
  .inputValidator(monthSummarySchema)
  .middleware([authMiddleware])
  .handler(async ({ data: { year, month } }) => {
    return await RecordService.getRecordsByMonth(year, month);
  });

const recordIdSchema = z.object({
  id: z.number().int().positive(),
});

export const getRecordById = createServerFn({
  method: "GET",
})
  .inputValidator(recordIdSchema)
  .middleware([authMiddleware])
  .handler(async ({ data: { id } }) => {
    return await RecordService.getRecordById(id);
  });

export const createRecord = createServerFn({
  method: "POST",
})
  .inputValidator(createOrUpdateRecordSchema)
  .middleware([authMiddleware])
  .handler(async ({ data }) => {
    return await RecordService.createRecord(data);
  });

export const updateRecord = createServerFn({
  method: "POST",
})
  .inputValidator(createOrUpdateRecordSchema)
  .middleware([authMiddleware])
  .handler(async ({ data }) => {
    return await RecordService.updateRecord(data);
  });

export const deleteRecord = createServerFn({
  method: "POST",
})
  .inputValidator(recordIdSchema)
  .middleware([authMiddleware])
  .handler(async ({ data: { id } }) => {
    return await RecordService.deleteRecord(id);
  });

const searchCommentSchema = z.object({
  comment: z.string().min(1),
});

export const searchRecordComments = createServerFn({
  method: "GET",
})
  .inputValidator(searchCommentSchema)
  .middleware([authMiddleware])
  .handler(async ({ data: { comment } }) => {
    return await RecordService.searchRecordComments(comment);
  });

export const getExpensesVsIncome = createServerFn({
  method: "GET",
})
  .middleware([authMiddleware])
  .handler(async () => {
    const result = await RecordService.getExpensesVsIncome();
    return result;
  });
