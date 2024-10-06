import { useContext, useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImStatsDots } from "react-icons/im";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { GiReceiveMoney } from "react-icons/gi";
import { ImExit } from "react-icons/im";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TokenContext } from "@/context/tokenContext";
import axios from "@/axios";

interface User {
  email?: string;
  password?: string;
  avatar?: string;
  firstName?: string;
  lastName?: string;
}

const Home = () => {
  const navigate = useNavigate();
  const { getToken, removeToken } = useContext(TokenContext);
  const [user, setUser] = useState<User | null>(null);

  const handleLogout = () => {
    removeToken();
    navigate("/auth/login");
  };

  const handleDataFetch = async (token: string | null) => {
    const res = await axios.get("/users/getUserById", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUser(res.data.user);
  };

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/auth/login");
    }
    handleDataFetch(token);
  }, [getToken, navigate]);

  return (
    <>
      <div className="grid h-screen w-screen grid-cols-12">
        <div className="md:col-span-3 col-span-2  m-3 md:flex flex-col justify-between rounded-2xl border-2  hidden">
          {/* Avatar */}
          <div className=" flex md:ml-[30px] ml-0 mt-10">
            <div className="flex items-center justify-center gap-4">
              <Avatar className="md:w-[60px] md:h-[60px] w-[40px] h-[40px] rounded-full object-contain">
                <AvatarImage
                  src={user?.avatar ? user.avatar : "https://github.com/shadcn.png"}
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="md:flex md:flex-col hidden">
                <h2 className="text-xl font-bold text-white">
                  {user?.firstName} {user?.lastName}
                </h2>
              </div>
            </div>
          </div>

          {/* Nav Bar */}
          <ul className=" md:ml-[40px] flex flex-col items-center gap-8 md:block mt-[-150px] text-[#C7D1DB]">
            <li>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                 `md:flex md:gap-5 md:items-center md:cursor-pointer md:mb-5 md:p-2 md:rounded-md md:transition-all md:duration-300 md:transform md:hover:scale-105 md:active:scale-95 md:w-[280px] ${
                    isActive ? "bg-orange-600 md:text-black text-orange-600 rounded-lg" : "hover:bg-orange-900"
                  }`
                }
              >
                <ImStatsDots size={25} />
                <p className="md:font-bold hidden md:block">Dashboard</p>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/incomes"
                className={({ isActive }) =>
                 `md:flex md:gap-5 md:items-center md:cursor-pointer md:mb-5 md:p-2 md:rounded-md md:transition-all md:duration-300 md:transform md:hover:scale-105 md:active:scale-95 md:w-[280px] ${
                    isActive ? "bg-orange-600 md:text-black text-orange-600 rounded-lg" : "hover:bg-orange-900"
                  }`
                }
              >
                <FaMoneyCheckDollar size={25} />
                <p className="md:font-bold hidden md:block">Incomes</p>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/expenses"
                className={({ isActive }) =>
                  `md:flex md:gap-5 md:items-center md:cursor-pointer md:mb-5 md:p-2 md:rounded-md md:transition-all md:duration-300 md:transform md:hover:scale-105 md:active:scale-95 md:w-[280px] ${
                    isActive ? "bg-orange-600 md:text-black text-orange-600 rounded-lg" : "hover:bg-orange-900"
                  }`
                }
              >
                <GiReceiveMoney size={25} />
                <p className="md:font-bold hidden md:block">Expenses</p>
              </NavLink>
            </li>
          </ul>

          {/* Logout Button */}
          <div className=" md:ml-[40px] mb-[20px]">
            <Button
              className="rounded-xl bg-white   text-black hover:bg-slate-500"
              onClick={handleLogout}
            >
              <ImExit className="md:text-xl text-md" />
              <h3 className="md:text-lg md:font-bold hidden md:block rounded-2xl">Log Out</h3>
            </Button>
          </div>
        </div>

        <div className="col-span-9 m-3 rounded-2xl">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Home;
