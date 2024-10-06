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

const Income: React.FC = () => {
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    date: undefined as Date | undefined,
    description: "",
  });
  const { getToken } = useContext(TokenContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState("");

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
    const formattedDate = formData.date
      ? formData.date.toISOString()
      : undefined;
    try {
      await axios.post(
        "/incomes/setIncome",
        { ...formData, date: formattedDate },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSubmissionStatus("Income added successfully!");
      setFormData({
        title: "",
        amount: "",
        category: "",
        date: undefined as Date | undefined,
        description: "",
      });
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        setSubmissionStatus(error.response?.data.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex md:items-center md:flex-row flex-col justify-center  gap-6 p-4 h-full md:border-2 border-0 rounded-xl scrollbar-hide">
      <Card className="mx-auto max-w-sm  ml-16 rounded-xl ">
        <CardHeader>
          <CardTitle className="text-xl">Add Income</CardTitle>
          <CardDescription>
            Enter details to add a new income entry
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
                  placeholder="e.g., Salary"
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
                  placeholder="e.g., 1000"
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
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Categories</SelectLabel>
                      <SelectItem value="Salary">Salary</SelectItem>
                      <SelectItem value="Freelance">Freelance</SelectItem>
                      <SelectItem value="Investment">Investment</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
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
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Adding Income..." : "Add Income"}
              </Button>
            </div>
            {submissionStatus && (
              <div className="mt-4 text-center text-sm">{submissionStatus}</div>
            )}
          </form>
        </CardContent>
      </Card>
      <InfoTable info="income" />
    </div>
  );
};

export default Income;
