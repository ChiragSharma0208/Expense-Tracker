import BarChat from "@/components/custom/charts/BarChat";
import CircleChart from "@/components/custom/charts/CircleChart";
import { useContext, useEffect, useState } from "react";
import axios from "@/axios";
import { TokenContext } from "@/context/tokenContext";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import AreasChart from "@/components/custom/charts/AreasChart";

export interface expenseInfo {
  amount: number;
  category: string;
  date: string;
  description?: string;
  title: string;
  _id: string;
}

const Dashboard = () => {
  const { getToken, removeToken } = useContext(TokenContext);
  const [expenses, setExpenses] = useState<[expenseInfo] | []>([]);
  const [incomes, setIncomes] = useState<[expenseInfo] | []>([]);
  const [prevMonthExpenses, setPrevMonthExpenses] = useState<number>(0);
  const [prevMonthIncomes, setPrevMonthIncomes] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleFetch = async () => {
      const token = getToken();

      try {
        const expenseRes = await axios.get("/expenses/getExpense", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const incomeRes = await axios.get("/incomes/getIncome", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setExpenses(expenseRes.data.expense);
        setIncomes(incomeRes.data.income);
        
        // Calculate previous month's income and expenses
        const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

        const prevMonthExpenses = expenseRes.data.expense.reduce((acc: number, expense: expenseInfo) => {
          const expenseDate = new Date(expense.date);
          if (expenseDate.getMonth() === previousMonth && expenseDate.getFullYear() === previousYear) {
            return acc + expense.amount;
          }
          return acc;
        }, 0);

        const prevMonthIncomes = incomeRes.data.income.reduce((acc: number, income: expenseInfo) => {
          const incomeDate = new Date(income.date);
          if (incomeDate.getMonth() === previousMonth && incomeDate.getFullYear() === previousYear) {
            return acc + income.amount;
          }
          return acc;
        }, 0);

        setPrevMonthExpenses(prevMonthExpenses);
        setPrevMonthIncomes(prevMonthIncomes);
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.data.message === "Error occured while authenticating user with token") {
            removeToken();
            return navigate("/auth/login");
          }

          console.log(error.response?.data.message);
        }
      }
    };

    handleFetch();
  }, [getToken, navigate, removeToken]);

  // Calculate total expenses and income for the current month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const totalExpenses = expenses.reduce((acc, expense) => {
    const expenseDate = new Date(expense.date);
    if (expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear) {
      return acc + expense.amount;
    }
    return acc;
  }, 0);

  const totalIncome = incomes.reduce((acc, income) => {
    const incomeDate = new Date(income.date);
    if (incomeDate.getMonth() === currentMonth && incomeDate.getFullYear() === currentYear) {
      return acc + income.amount;
    }
    return acc;
  }, 0);

  // Calculate percentage change
  const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const incomeChange = calculatePercentageChange(totalIncome, prevMonthIncomes);
  const expenseChange = calculatePercentageChange(totalExpenses, prevMonthExpenses);

  return (
    <div className="rounded-2xl flex gap-8 h-full border-2 p-4">
      <div className="flex flex-col gap-14">
        <AreasChart expenses={expenses} incomes={incomes} />
        <BarChat expenses={expenses} />
      </div>
      <div className="flex flex-col gap-12">
        <CircleChart expenses={expenses} />
        <div className="flex gap-6">
  <div className="border-2 rounded-xl w-[200px] h-[150px] p-4">
    <h2 className="text-sm font-semibold text-[#7d7366]">Total Income</h2>
    <p className="text-3xl font-bold text-white mt-2">{totalIncome.toFixed(2)}</p>
    <p className={`text-sm mt-1 ${incomeChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
  <span>{incomeChange >= 0 ? '▲' : '▼'}</span> {Math.abs(incomeChange).toFixed(2)}%
</p>
  </div>
  <div className="border-2 rounded-xl w-[200px] h-[150px] p-4">
    <h2 className="text-sm font-semibold text-[#7d7366]">Total Expenses</h2>
    <p className="text-3xl font-bold text-white mt-2">{totalExpenses.toFixed(2)}</p>
    <p className={`text-sm mt-1 ${expenseChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
  <span>{incomeChange >= 0 ? '▲' : '▼'}</span> {Math.abs(expenseChange).toFixed(2)}%
</p>
  </div>
</div>

      </div>
    </div>
  );
};

export default Dashboard;
