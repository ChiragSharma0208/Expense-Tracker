import React, { useState, ChangeEvent, FormEvent, useContext } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import axios from "@/axios";
import { AxiosError } from "axios";
import { TokenContext } from "@/context/tokenContext";
import InfoTable from "@/components/custom/InfoTable";


const Expenses: React.FC = () => {
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    date: undefined as Date | undefined,
    description: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState("");
  const { getToken } = useContext(TokenContext);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleDateChange = (newDate: Date | undefined) => {
    setFormData((prevData) => ({ ...prevData, date: newDate }));
  };
  
  const handleCategoryChange = (value: string) => {
    setFormData((prevData) => ({ ...prevData, category: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionStatus("");
    const token = getToken();
    const formattedDate = formData.date ? formData.date.toISOString() : undefined;
    try {
      await axios.post("/expenses/setExpense", { ...formData, date: formattedDate }, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      setFormData({
        title: "",
        amount: "",
        category: "",
        date: undefined as Date | undefined,
        description: "",
      });
      setSubmissionStatus("Expense added successfully!");
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        setSubmissionStatus(error.response?.data.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex md:items-center md:flex-row flex-col gap-6  p-4 h-full scrollbar-hide  md:border-2 border-0 rounded-xl">
      <Card className="mx-auto max-w-sm ml-12 rounded-xl">
        <CardHeader>
          <CardTitle className="text-xl">Add Expense</CardTitle>
          <CardDescription>
            Enter details to add a new expense
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="e.g., Groceries"
                  className="border-slate-500"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="e.g., 100"
                  className="border-slate-500"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={handleCategoryChange}
                  required
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Categories</SelectLabel>
                      <SelectItem value="Food">Food</SelectItem>
                      <SelectItem value="Transportation">Transportation</SelectItem>
                      <SelectItem value="Shopping">Shopping</SelectItem>
                      <SelectItem value="Entertainment">Entertainment</SelectItem>
                      <SelectItem value="Health">Health</SelectItem>
                      <SelectItem value="Bills">Bills</SelectItem>
                      <SelectItem value="Others">Others</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !formData.date && "text-muted-foreground"
                      )}
                    >
                      {formData.date ? (
                        format(formData.date, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.date}
                      className="rounded-md border"
                      onSelect={handleDateChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  type="text"
                  placeholder="Optional"
                  className="border-slate-500"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Adding Expense..." : "Add Expense"}
              </Button>
            </div>
            {submissionStatus && (
              <div className="mt-4 text-center text-sm">
                {submissionStatus}
              </div>
            )}
          </form>
        </CardContent>
      </Card>
      <InfoTable info="expense"/>
    </div>
  );
};

export default Expenses;
