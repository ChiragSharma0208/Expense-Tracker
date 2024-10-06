import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GoDash } from "react-icons/go";
import axios from "@/axios";
import  { useContext, useEffect, useState } from "react";
import { TokenContext } from "@/context/tokenContext";

interface incomeInfo {
  amount: number;
  category: string;
  date: string;
  description?: string;
  title: string;
  _id: string;
}
interface Props{
  info:string
}

const InfoTable:React.FC<Props> = ({info}) => {
  const { getToken } = useContext(TokenContext);
  const [incomes, setIncomes] = useState<[incomeInfo]|[]>([]);

  useEffect(() => {
    const handleFetch = async () => {
      const token = getToken();
      const res = await axios.get(info==="income"?"/incomes/getIncome":"/expenses/getExpense", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIncomes(info==="income"?res.data.income: res.data.expense);
    };

    handleFetch();
  }, [getToken, incomes,info]);

  return (
    <div className="overflow-y-auto max-h-[300px]  border-2 rounded-xl scrollbar-custom">
      <Table className="w-full">
      <TableHeader>
        <TableRow>
          <TableHead  className="text-primary">Title</TableHead>
          <TableHead  className="text-primary">Amount</TableHead>
          <TableHead  className="text-primary">Cateogry</TableHead>
          <TableHead  className="text-primary">Date</TableHead>
          <TableHead  className="text-primary">Description</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {incomes?.map((income) => (
          
          <TableRow key={income._id}>
            <TableCell className="font-medium">{income.title}</TableCell>
            <TableCell>{income.amount}</TableCell>
            <TableCell>{income.category}</TableCell>
            <TableCell>{new Date(income.date).toLocaleDateString()}</TableCell>
            <TableCell>{income.description===""?<GoDash scale={60}/>:income.description}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </div>
  );
};

export default InfoTable;
