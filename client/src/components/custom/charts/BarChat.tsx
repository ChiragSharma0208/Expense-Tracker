import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {  useState } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { expenseInfo } from "@/pages/Dashboard";

export interface expenseType {
  expenses: expenseInfo[];
}


const BarChat:React.FC<expenseType> = ({expenses}) => {
  
  const [toggle, setToggle] = useState<string>("");

  

  let chartData = [];
  const currentMonth = new Date().getMonth();

  const filteredExpenses = expenses.filter((expense:expenseInfo) => {
    const expenseYear = new Date(expense.date).getFullYear();
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
    const desktopValue = monthlyExpenses[i] || 0;

    chartData.push({
      month: months[i],
      desktop: desktopValue,
    });
  }
  chartData = chartData.filter((data)=>{
    return data.desktop!=0;
  })
  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  const handleChange = (value:string)=>{
      setToggle(value);
       console.log(toggle)
  }
  
  return (
    <Card className="w-[400px] rounded-xl border-2">
      <CardHeader>
        <div className="flex relative justify-between">
        <CardTitle>Bar Chart</CardTitle>
        <Select onValueChange={handleChange}> 
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder="Month" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="jan">Jan-Jun</SelectItem>
          <SelectItem value="jul">Jul-Dec</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
        </div>
        
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 35,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default BarChat;
