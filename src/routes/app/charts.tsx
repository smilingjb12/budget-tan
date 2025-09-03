import { createFileRoute } from "@tanstack/react-router";
import { ExpenseTrendsChart } from "~/components/expense-trends-chart";
import { ExpensesVsIncomeChart } from "~/components/expenses-vs-income-chart";
import { IncomeTrendsChart } from "~/components/income-trends-chart";
import { IncomeByYearChart } from "~/components/income-by-year-chart";

export const Route = createFileRoute("/app/charts")({
  component: ChartsPage,
});

function ChartsPage() {
  return (
    <div className="py-1 space-y-4">
      <h1 className="text-xl font-bold mb-6 px-4">Charts</h1>
      <ExpenseTrendsChart />
      <ExpensesVsIncomeChart />
      <IncomeTrendsChart />
      <IncomeByYearChart />
    </div>
  );
}
