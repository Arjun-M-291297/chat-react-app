import { React, useState } from "react";
import { auth, storage, db } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { Spinner, useToast } from "@chakra-ui/react";
import uploadImg from "../assets/uploadimg.png"
const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const handleSubmit = async (e) => {
    setLoading(true)
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      // Create the file metadata
      /** @type {any} */
      const metadata = {
        contentType: "image/jpeg",
      };

      const storageRef = ref(storage, displayName);
      const uploadTask = await uploadBytesResumable(storageRef, file, metadata);
      if (uploadTask.state == "success") {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.ref).then(async (downloadURL) => {
          await updateProfile(res.user, {
            displayName,
          });
          await setDoc(doc(db, "users", res.user.uid), {
            uid: res.user.uid,
            displayName,
            email,
            photoURL: downloadURL,
          });
          await setDoc(doc(db, "userChats", res.user.uid), {});
          setLoading(false);
          toast({
            title: "Successfully signed up",
            isClosable: true,
            status: "success",
          });
          navigate("/");
        });
      }
    } catch (err) {
      toast({
        title: err.message,
        isClosable: true,
        status: "error",
      });
      setLoading(false);
    }
  };
  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">ChatApp</span>
        <span className="title">Register</span>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Display name"></input>
          <input type="email" placeholder="Email"></input>
          <input type="password" placeholder="Password"></input>
          <input style={{ display: "none" }} type="file" id="file"></input>
          <label htmlFor="file">
            <img src={uploadImg} alt="upload-image-toBe"></img>
          </label>
          <button>Sign Up</button>
        </form>
        <p>
          You have an account? <Link to="/login">Login</Link>
        </p>
      </div>
        {loading && <div className="container-spinner"><Spinner size="xl" color="yellow.500" /></div>}
    </div>
  );
};

export default Register;
