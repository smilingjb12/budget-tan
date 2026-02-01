import { createFileRoute } from "@tanstack/react-router";
import { ExpenseTrendsChart } from "~/components/expense-trends-chart";
import { ExpenseByItemChart } from "~/components/expense-by-item-chart";
import { ExpensesVsIncomeChart } from "~/components/expenses-vs-income-chart";
import { IncomeTrendsChart } from "~/components/income-trends-chart";
import { IncomeByYearChart } from "~/components/income-by-year-chart";

export const Route = createFileRoute("/app/charts")({
  component: ChartsPage,
});

function ChartsPage() {
  return (
    <div className="space-y-4">
      <ExpenseTrendsChart />
      <ExpenseByItemChart />
      <ExpensesVsIncomeChart />
      <IncomeTrendsChart />
      <IncomeByYearChart />
    </div>
  );
}
