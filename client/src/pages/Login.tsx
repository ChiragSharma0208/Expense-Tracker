import React, { useState, ChangeEvent,useContext, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import axios from '@/axios'
import { AxiosError } from "axios";
import { TokenContext } from "@/context/tokenContext";

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const {setToken} = useContext(TokenContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState("");
  const navigate=useNavigate();
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionStatus("");
    try {
      const response = await axios.post("/users/login",formData);
      setSubmissionStatus("Login successful!");
      setToken(response.data.token);
      navigate('/dashboard')
    } 
    catch (error:unknown) {
      if(error instanceof AxiosError){
        setSubmissionStatus(error.response?.data.message)
      }
      
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="mx-auto max-w-sm bg-transparent rounded-xl">
        <CardHeader>
          <CardTitle className="text-xl">Login</CardTitle>
          <CardDescription className="">
            Enter your email and password to login
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  className=""
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <Button type="submit" className="w-full " disabled={isSubmitting}>
                {isSubmitting ? "Logging in..." : "Log In"}
              </Button>
              <Button variant="outline" className="w-full border-[1px] rounded-lg ">
                Log in with Google
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don't have an account?{" "}
              <Link to="/auth/signup" className="underline">
                Sign up
              </Link>
            </div>
            {submissionStatus && (
              <div className="mt-4 text-center text-sm text-white">
                {submissionStatus}
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
