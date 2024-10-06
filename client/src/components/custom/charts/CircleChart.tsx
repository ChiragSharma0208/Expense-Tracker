import { Label, Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMemo, useState } from "react";
import { expenseType } from "./BarChat";
import { expenseInfo } from "@/pages/Dashboard";

// Define the type for the data used in the PieChart
interface PieData {
  month: string;
  desktop: number;
  fill: string;
}

// Define the monthColors type
const monthColors: Record<string, string> = {
  January: "var(--color-january)",
  February: "var(--color-february)",
  March: "var(--color-march)",
  April: "var(--color-april)",
  May: "var(--color-may)",
  June: "var(--color-june)",
  July: "var(--color-july)",
  August: "var(--color-august)",
  September: "var(--color-september)",
  October: "var(--color-october)",
  November: "var(--color-november)",
  December: "var(--color-december)",

};
const chartConfig: ChartConfig = {
  january: {
    label: "January",
    color: "hsl(0, 100%, 74%)", // #FF8A80
  },
  february: {
    label: "February",
    color: "hsl(330, 100%, 74%)", // #FF80AB
  },
  march: {
    label: "March",
    color: "hsl(290, 100%, 85%)", // #EA80FC
  },
  april: {
    label: "April",
    color: "hsl(240, 100%, 85%)", // #8C9EFF
  },
  may: {
    label: "May",
    color: "hsl(190, 100%, 75%)", // #80D8FF
  },
  june: {
    label: "June",
    color: "hsl(160, 100%, 75%)", // #A7FFEB
  },
  july: {
    label: "July",
    color: "hsl(90, 55%, 75%)", // #C5E1A5
  },
  august: {
    label: "August",
    color: "hsl(50, 100%, 75%)", // #FFE57F
  },
  september: {
    label: "September",
    color: "hsl(30, 100%, 75%)", // #FFCC80
  },
  october: {
    label: "October",
    color: "hsl(15, 100%, 75%)", // #FFAB91
  },
  november: {
    label: "November",
    color: "hsl(10, 100%, 75%)", // #FF9E80
  },
  december: {
    label: "December",
    color: "hsl(270, 50%, 75%)", // #B39DDB
  },
};


const CircleChart: React.FC<expenseType> = ({ expenses }) => {
  const currentMonth = new Date().getMonth();

  // Filter expenses for the year 2024
  const filteredExpenses = expenses.filter((expense: expenseInfo) => {
    const expenseYear = new Date(expense.date).getFullYear();
    return expenseYear === 2024;
  });

  // Group expenses by month and calculate total for each month
  const monthlyExpenses = filteredExpenses.reduce(
    (acc: { [key: number]: number }, expense) => {
      const expenseMonth = new Date(expense.date).getMonth();
      acc[expenseMonth] = (acc[expenseMonth] || 0) + expense.amount;
      return acc;
    },
    {}
  );


  // Generate desktopData based on filtered expenses
  // eslint-disable-next-line react-hooks/exhaustive-deps
  let desktopData: PieData[] = [];
  const months = ["January", "February", "March", "April", "May", "June","July","August","September","October","November","December"];

  for (let i = 0; i <= currentMonth && i < months.length; i++) {
    const desktopValue = monthlyExpenses[i] || 0;
    desktopData.push({
      month: months[i],
      desktop: desktopValue,
      fill: monthColors[months[i]],
    });
  }
  desktopData = desktopData.filter((data)=>{
    return data.desktop!=0;
  })
  const id = "pie-interactive";
  const [activeMonth, setActiveMonth] = useState<string>(
    months[currentMonth]||desktopData[0]?.month || ""
  );
  const activeIndex = useMemo(
    () => desktopData.findIndex((item) => item.month === activeMonth),
    [activeMonth, desktopData]
  );
 const newYear = new Date().getFullYear();
  return (
    <Card data-chart={id} className="flex flex-col rounded-2xl">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle>Pie Chart</CardTitle>
          <CardDescription>{newYear}</CardDescription>
        </div>
        <Select value={activeMonth} onValueChange={setActiveMonth}>
          <SelectTrigger
            className="ml-auto h-7 w-[130px] rounded-lg pl-2.5"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            {desktopData.map((item) => (
              <SelectItem
                key={item.month}
                value={item.month}
                className="rounded-lg [&_span]:flex"
              >
                <div className="flex items-center gap-2 text-xs">
                  <span
                    className="flex h-3 w-3 shrink-0 rounded-sm"
                    style={{ backgroundColor: item.fill }}
                  />
                  {item.month}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        <ChartContainer
          id={id}
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={desktopData}
              dataKey="desktop"
              nameKey="month"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={activeIndex}
              activeShape={({
                outerRadius = 0,
                ...props
              }: PieSectorDataItem) => (
                <g>
                  <Sector {...props} outerRadius={outerRadius + 10} />
                  <Sector
                    {...props}
                    outerRadius={outerRadius + 25}
                    innerRadius={outerRadius + 12}
                  />
                </g>
              )}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {desktopData[activeIndex]?.desktop.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Expenses
                        </tspan>
                      </text>
                    );
                  }
                  return null;
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default CircleChart;
