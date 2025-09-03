import { createServerFn } from "@tanstack/react-start";
import {
  RecordService,
  CreateOrUpdateRecordRequest,
} from "~/services/record-service";
import { Month } from "~/lib/routes";

export const getMonthSummary = createServerFn({
  method: "GET",
})
  .validator(({ year, month }: { year: number; month: Month }) => ({
    year,
    month,
  }))
  .handler(async ({ data: { year, month } }) => {
    return await RecordService.getMonthSummary(year, month);
  });

export const getAllTimeSummary = createServerFn({
  method: "GET",
}).handler(async () => {
  return await RecordService.getAllTimeSummary();
});

export const getRecordsByMonth = createServerFn({
  method: "GET",
})
  .validator(({ year, month }: { year: number; month: Month }) => ({
    year,
    month,
  }))
  .handler(async ({ data: { year, month } }) => {
    return await RecordService.getRecordsByMonth(year, month);
  });

export const getRecordById = createServerFn({
  method: "GET",
})
  .validator(({ id }: { id: number }) => ({ id }))
  .handler(async ({ data: { id } }) => {
    return await RecordService.getRecordById(id);
  });

export const createRecord = createServerFn({
  method: "POST",
})
  .validator((data: CreateOrUpdateRecordRequest) => data)
  .handler(async ({ data }) => {
    return await RecordService.createRecord(data);
  });

export const updateRecord = createServerFn({
  method: "POST",
})
  .validator((data: CreateOrUpdateRecordRequest) => data)
  .handler(async ({ data }) => {
    return await RecordService.updateRecord(data);
  });

export const deleteRecord = createServerFn({
  method: "POST",
})
  .validator(({ id }: { id: number }) => ({ id }))
  .handler(async ({ data: { id } }) => {
    return await RecordService.deleteRecord(id);
  });

export const searchRecordComments = createServerFn({
  method: "GET",
})
  .validator(({ comment }: { comment: string }) => ({ comment }))
  .handler(async ({ data: { comment } }) => {
    return await RecordService.searchRecordComments(comment);
  });

export const getExpensesVsIncome = createServerFn({
  method: "GET",
}).handler(async () => {
  const result = await RecordService.getExpensesVsIncome();
  return result;
});
