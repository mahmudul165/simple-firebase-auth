import "./App.css";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  FacebookAuthProvider,
} from "firebase/auth";
import initializeAuthentication from "./Firebase/firebase.init";
import { useState } from "react";

initializeAuthentication();
const googleProvider = new GoogleAuthProvider();
const gitProvider = new GithubAuthProvider();
const facebookProvider = new FacebookAuthProvider();
function App() {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [user, setuser] = useState({});
  const [error, seterror] = useState("");
  const [isLogin, setisLogin] = useState(false);
  const auth = getAuth();
  const handle = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        // const user = result.user;

        const { displayName, email, photoURL, uid } = result.user;
        const loged = {
          name: displayName,
          email: email,
          photo: photoURL,
          id: uid,
        };
        setuser(loged);
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };
  const handleGit = () => {
    signInWithPopup(auth, gitProvider).then((result) => {
      //const user = result.user;
      console.log(result.user);
      const { displayName, email, photoURL, uid } = result.user;
      const loged = {
        name: displayName,
        email: email,
        photo: photoURL,
        id: uid,
      };
      setuser(loged);
    });
  };
  const handleOut = () => {
    signOut(auth).then(() => {
      setuser({});
    });
  };
  const handleFacebook = () => {
    signInWithPopup(auth, facebookProvider)
      .then((result) => {
        const { displayName, email, photoURL, uid } = result.user;
        const loged = {
          name: displayName,
          email: email,
          photo: photoURL,
          id: uid,
        };
        setuser(loged);
      })
      .catch((error) => {
        seterror(error.message);
      });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(name, email, password);
    if (password.length <= 6) {
      seterror("password should be 6 character");
      return;
    }
    if (!/(?=.*?[A-Z])/.test(password)) {
      seterror("At least one upper case English letter");
      return;
    }
    if (!/(?=.*?[a-z])/.test(password)) {
      seterror("At least one lower case English letter");
      return;
    }
    if (!/(?=.*?[#?!@$%^&*-])/.test(password)) {
      seterror("At least one special character");
      return;
    }

    const processLogin = (email, password) => {
      signInWithEmailAndPassword(auth, email, password)
        .then((result) => {
          // Signed in
          const user = result.user;
          console.log(user);
          seterror("");
        })
        .catch((error) => {
          seterror(error.message);
        });
    };

    const createNewUser = (email, password) => {
      createUserWithEmailAndPassword(auth, email, password)
        .then((result) => {
          const user = result.user;
          console.log(user);
          seterror("");
          verifyEmail();
          setUserName();
        })
        .catch((error) => {
          seterror(error.message);
        });
    };
    const verifyEmail = () => {
      sendEmailVerification(auth.currentUser).then((result) => {
        console.log(result);
      });
    };

    isLogin ? processLogin(email, password) : createNewUser(email, password);
    // createUserWithEmailAndPassword(auth, email, password)
    //   .then((result) => {
    //     const user = result.user;
    //     console.log(user);
    //     seterror("");
    //   })
    //   .catch((error) => {
    //     seterror(error.message);
    //   });
  };
  const handleNameChange = (e) => {
    setname(e.target.value);
  };
  const handleEmailChange = (e) => {
    setemail(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setpassword(e.target.value);
  };
  const toggleLogin = (e) => {
    setisLogin(e.target.checked);
  };
  const handleResetPassword = () => {
    sendPasswordResetEmail(auth, email).then((result) => {
      console.log(result);
    });
  };
  const setUserName = () => {
    updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: "https://avatars.githubusercontent.com/u/61279339?v=4",
    }).then((result) => {});
  };
  return (
    <div className="mx-5">
      <br />
      <br />
      <br />
      <br />
      <form onSubmit={handleSubmit}>
        <h3 className="text-primary">
          Please {isLogin ? "Login" : "Register"}
        </h3>
        {!isLogin && (
          <div className="row mb-3">
            <label htmlFor="inputName3" className="col-sm-2 col-form-label">
              Name
            </label>
            <div className="col-sm-10">
              <input
                type="text"
                onBlur={handleNameChange}
                className="form-control"
                id="inpuName3"
                required
              />
            </div>
          </div>
        )}
        {/* email  */}
        <div className="row mb-3">
          <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">
            Email
          </label>
          <div className="col-sm-10">
            <input
              type="email"
              onBlur={handleEmailChange}
              className="form-control"
              id="inputEmail3"
              required
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">
            Password
          </label>
          <div className="col-sm-10">
            <input
              type="password"
              onBlur={handlePasswordChange}
              className="form-control"
              id="inputPassword3"
              required
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-sm-10 offset-sm-2">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="gridCheck1"
                onClick={toggleLogin}
              />
              <label className="form-check-label" htmlFor="gridCheck1">
                Already Registered?
              </label>
            </div>
          </div>
          <div>{error}</div>
        </div>
        <button type="submit" className="btn btn-primary">
          {isLogin ? "Login" : "Register"}
        </button>

        {isLogin && (
          <button
            type="button"
            onClick={handleResetPassword}
            className="mx-4 btn btn-secondary"
          >
            Reset password
          </button>
        )}
      </form>
      <div>
        ---------------------------------------------------------------------------------
      </div>
      <br />
      <br />
      <br />
      {!user.name ? (
        <div>
          <button className="btn btn-primary" onClick={handle}>
            google sign
          </button>
          <button className="btn btn-danger" onClick={handleGit}>
            github sign
          </button>
          <button className="btn btn-warning" onClick={handleFacebook}>
            Facebook sign
          </button>
        </div>
      ) : (
        <button className="btn btn-secondary" onClick={handleOut}>
          sign out
        </button>
      )}

      <br />
      {user.name && (
        <div>
          <h1>{user.name}</h1>
          <h5>{user.email}</h5>
          <p>{user.id}</p>
          <img src={user.photo} alt="" />
        </div>
      )}
    </div>
  );
}

export default App;
