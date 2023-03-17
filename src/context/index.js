import { useContext, createContext, useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  onAuthStateChanged,
  getAdditionalUserInfo,
} from "firebase/auth";
import { auth, db } from "../config";
import { collection, setDoc, doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const addUser = async (userData) => {
    const postData = {
      ...userData,
      role: "user",
      orders: [],
    };
    console.log(postData);
    const docRef = doc(db, "Users", userData.uid);
    const data = await setDoc(docRef, postData);

    if (!data) {
      setUser(postData);
    }
  };

  const getUser = async (userData) => {
    const docRef = doc(db, "Users", userData.uid);
    const dataSnap = await getDoc(docRef);
    if (dataSnap.exists()) {
      const userData = dataSnap.data();
      console.log(userData);
      setUser(userData);
    }
  };
  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    // signInWithPopup(auth, provider);
    signInWithPopup(auth, provider)
      .then((res) => {
        // setUser(res.user.providerData[0]);
        const details = getAdditionalUserInfo(res);
        if (details.isNewUser) {
          // add data to firestore
          addUser(res.user.providerData[0]);
        } else {
          getUser(res.user.providerData[0]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const logOut = () => {
    signOut(auth)
      .then((res) => {
        setUser(null);
      })
      .catch((err) => {});
  };

  //   useEffect(() => {
  //     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
  //       setUser(currentUser);
  //       console.log("User", currentUser.additionalUserInfo);
  //     });
  //     return () => {
  //       unsubscribe();
  //     };
  //   }, []);

  return (
    <AuthContext.Provider value={{ googleSignIn, logOut, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
