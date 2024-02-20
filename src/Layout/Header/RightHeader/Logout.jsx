import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import man from "../../../assets/images/dashboard/profile.png";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import { FileText, LogIn, Mail, User } from "react-feather";

import { LI, UL, Image, P } from "../../../AbstractElements";
import CustomizerContext from "../../../_helper/Customizer";
import { Account, Admin, Inbox, LogOut, Taskboard } from "../../../Constant";
import BasicMenu from "./UserDropdown";
import { useDisconnect } from "wagmi";
import MyContext from "../../../Context/MyContext";
import { useAccount } from "wagmi";
import { checkAddressExists } from "../../../api/integrateConfig";

const Logout = () => {
  const history = useNavigate();
  const { address } = useAccount();
  const { userData } = useContext(MyContext);
  const { disconnect } = useDisconnect();
  const [profile, setProfile] = useState("");
  const [name, setName] = useState(userData ? userData.name : "Test");
  const { layoutURL } = useContext(CustomizerContext);
  const authenticated = JSON.parse(localStorage.getItem("authenticated"));
  const auth0_profile = JSON.parse(localStorage.getItem("auth0_profile"));
  const checkAccountExists = async (account_address) => {
    try {
      if (!account_address) {
        return;
      }
      let response = await checkAddressExists(account_address);
      console.log(response, "header");
      if (!response.data) {
        window.location.href = "/login";
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    setProfile(localStorage.getItem("profileURL"));
    setName(localStorage.getItem("Name") ? localStorage.getItem("Name") : name);
  }, []);

  const Logout = () => {
    localStorage.removeItem("profileURL");
    localStorage.removeItem("token");
    localStorage.removeItem("auth0_profile");
    localStorage.removeItem("Name");
    localStorage.setItem("authenticated", false);
    disconnect();
    history(`/login`);
  };

  const UserMenuRedirect = (redirect) => {
    history(redirect);
  };

  useEffect(() => {
    if (address) {
      checkAccountExists(address);
    } else {
      window.location.href = "/login";
    }
  }, [address]);

  return (
    <div
      onClick={Logout}
      style={{ color: "#ffffff", padding: "12px 20px", fontSize: "15px",display:"flex",gap:"5px",cursor:"pointer"}}
      className={`sidebar-link sidebar-title link-nav }`}
    >
      <p>
        <LogIn />
      </p>
      <p>Log Out</p>
    </div>
  );
};

export default Logout;

{
  /* <LI
          attrLI={{
            onClick: () => UserMenuRedirect(`/app/email-app/${layoutURL}`),
          }}>
          <Mail />
          <span>{Inbox}</span>
        </LI> */
}
{
  /* <LI
          attrLI={{
            onClick: () => UserMenuRedirect(`/app/todo-app/todo/${layoutURL}`),
          }}>
          <FileText />
          <span>{Taskboard}</span>
        </LI> */
}
