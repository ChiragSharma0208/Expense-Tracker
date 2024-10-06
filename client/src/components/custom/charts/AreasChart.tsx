
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { expenseInfo } from "@/pages/Dashboard"

interface info{
  expenses:expenseInfo[];
  incomes:expenseInfo[];
}
interface chartDataType{
  month:string;
  expense:number;
  income:number;
}


  const chartConfig = {
    income: {
      label: "Income",
      color: "hsl(var(--chart-1))",
    },
    expense: {
      label: "Expense",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig




const AreasChart:React.FC<info> = ({expenses,incomes}) => {
  const currentMonth = new Date().getMonth();
  let chartData:chartDataType[]= [];
  const filteredExpenses = expenses.filter((expense:expenseInfo) => {
    const expenseYear = new Date(expense.date).getFullYear();
    return expenseYear === 2024;
  });
  const filteredIncome = incomes.filter((income:expenseInfo) => {
    const expenseYear = new Date(income.date).getFullYear();
    return expenseYear === 2024;
  });

  // Group expenses by month and calculate total for each month
  const monthlyExpenses = filteredExpenses.reduce(
    (acc: { [key: number]: number }, expense) => {
      const expenseMonth = new Date(expense.date).getMonth(); // 0 for January, 11 for December

      acc[expenseMonth] = (acc[expenseMonth] || 0) + expense.amount;
      return acc;
    },
    {}
  );
  const monthlyIncomes = filteredIncome.reduce(
    (acc: { [key: number]: number }, income) => {
      const incomeMonth = new Date(income.date).getMonth(); // 0 for January, 11 for December

      acc[incomeMonth] = (acc[incomeMonth] || 0) + income.amount;
      return acc;
    },
    {}
  );

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  for (let i = 0; i <= currentMonth; i++) {
    const expenseValue = monthlyExpenses[i] || 0;
    const incomeValue = monthlyIncomes[i] || 0;

    chartData.push({
      month: months[i],
      expense: expenseValue,
      income: incomeValue
    });
  }
  chartData = chartData.filter((data)=>{
    return data.expense!=0 && data.income!=0;
  })
  const date = `${chartData[0]?.month} ${new Date().getFullYear()} - ${chartData[chartData?.length-1]?.month} ${new Date().getFullYear()}`

    return (
        <Card className="w-[450px] rounded-2xl">
          <CardHeader>
            <CardTitle>Area Chart</CardTitle>
            <CardDescription>
              {date}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <AreaChart
                accessibilityLayer
                data={chartData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Area
                  dataKey="expense"
                  type="natural"
                  fill="var(--color-expense)"
                  fillOpacity={0.4}
                  stroke="var(--color-expense)"
                  stackId="a"
                />
                <Area
                  dataKey="income"
                  type="natural"
                  fill="var(--color-income)"
                  fillOpacity={0.4}
                  stroke="var(--color-income)"
                  stackId="a"
                />
                <ChartLegend content={<ChartLegendContent />} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )
}

export default AreasChart
