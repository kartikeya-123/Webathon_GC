import React, { useEffect } from "react";
import { UserAuth } from "../../context/index";
import { useNavigate } from "react-router-dom";
import Login from "./SaaSProductLandingPage"
import GlobalStyles from "./styles/styles/GlobalStyles";
import { GoogleAuthProvider } from "firebase/auth";
import { css } from 'styled-components/macro'; //eslint-disable-line

const Signin = () => {
  const { googleSignIn, user } = UserAuth();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user != null) {
      //   window.location.reload();
    }
  }, [user]);

  return (
   <>
     <GlobalStyles></GlobalStyles>
      
        <Login handleGoogleSignIn={handleGoogleSignIn}></Login>
        </>
   
  );
};

export default Signin;
