import "../styles/globals.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import Login from "./login";
import Loading from "../Components/Loading";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { useEffect } from "react";
function MyApp({ Component, pageProps }) {
    const [user, loading] = useAuthState(auth);

    useEffect(() => {
        async function userInfo() {
            if (user) {
                const users = doc(db, "users", user.uid);
                await setDoc(
                    users,
                    {
                        email: user.email,
                        lastSeen: serverTimestamp(),
                        photoURL: user.photoURL,
                    },

                    { capital: true },
                    { merge: true }
                );
            }
        }
        userInfo();
    }, [user]);
    if (loading) return <Loading />;

    if (!user) return <Login />;

    return <Component {...pageProps} />;
}

export default MyApp;
