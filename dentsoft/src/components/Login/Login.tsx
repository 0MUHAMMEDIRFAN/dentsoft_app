import "./Login.css";
import React, { useContext, useState } from "react";
import Logo from "../../assets/DentalLogo.svg";
import showPasswordIcon from "./ShowPassword.svg";
import hidePasswordIcon from "./HidePassword.svg";
import { useNavigate } from "react-router-dom";
// import { loginToApp } from "../../Api/Index";
// import { loginUser } from "../../Api/UserApi";
import { AppContext } from "../../contexts/AppContext";
// import { ApiContext } from "../../contexts/ApiContext";
import { useFrappeAuth } from "frappe-react-sdk";

function Login() {
  const { login: frappeLogin, error: frappeError,isLoading } = useFrappeAuth();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  // const { setUserDetails } = useContext(AppContext)
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const userLogin = async () => {
    try {
      const payload = form;
      const login = await frappeLogin(payload);
      console.log(login, "Login Successful");
      console.log(frappeError, "Frappe Error");
      // setUserDetails(login.full_name)
      // localStorage.setItem("userDetails", JSON.stringify(login.full_name));
      // localStorage.setItem("access_token", login.access_token);
      // localStorage.setItem("refresh_token", login.refresh_token);
      setForm(() => ({
        username: "",
        password: "",
      }));
      navigate("/");
    } catch (error: any) {
      console.log(error);
      setError(error.message);
    }
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isLoading) {
      setError("");
      // loginAsAdmin ? adminLogin() : 
      userLogin()
    }
  };

  return (
    <div className="loginContainer">
      <div className="logo pop_up">
        <img src={Logo} alt="" />
      </div>
      <form className="loginForm relative pop_up" onSubmit={handleSubmit}>
        <h1 className="flex items-center justify-center w-full custom-transition ">Login
          {/* <p className={`${loginAsAdmin ? "w-[80px]" : "opacity-0 w-0"} text-base font-medium whitespace-nowrap custom-transition`}>&nbsp;as admin</p> */}
        </h1>
        <div className="rounded-md">
          <input
            type="text"
            onChange={handleChange}
            value={form.username}
            id="email"
            name="username"
            required
            autoComplete=""
            disabled={isLoading}
          />
          <p>Enter your email</p>
        </div>
        <div className="rounded-md relative">
          <input
            type={showPassword ? "text" : "password"}
            onChange={handleChange}
            value={form.password}
            id="password"
            name="password"
            required
            autoComplete="new-password"
            disabled={isLoading}
          />
          <p>Password</p>
          <span onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer">
            {showPassword ?
              <img src={showPasswordIcon} alt="" />
              : <img src={hidePasswordIcon} alt="" />
            }
          </span>
        </div>
        <div className="source">
          <p className="login-error">{error}</p>
          {/* <a className="custom-transition" onClick={changeLoginType}>{loginAsAdmin ? "Are you a User ?" : "Are you an Admin ?"}</a> */}
        </div>
        <button className={`${isLoading ? "opacity-70 cursor-wait active:scale-100" : "hover:bg-[#3E42FA]"} text-sm bg-[#6063FF] w-full h-12 font-semibold rounded-md custom-transition text-white`} type="submit">{isLoading ? <i className='bx bx-loader-alt animate-spin'></i> : "Login"}</button>
      </form>
    </div>
  );
}

export default Login;
