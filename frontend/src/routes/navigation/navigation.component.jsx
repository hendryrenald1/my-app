import { Link, Outlet } from "react-router-dom";
import { Fragment ,useContext } from "react";
import "./navigation.styles.scss";
import { ReactComponent as Logo } from "../../assets/logo.svg";
  
import { signOutUser } from '../../utils/firebase/firebase.utils'; 
import { UserContext } from "../../components/context/user.context";

const Navigation = () => {
  const { user ,setUser } = useContext(UserContext);

  const handleSignOut = async () => {
    try {
      const result = await signOutUser();
      setUser(null);
      console.log("User signed out successfully");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  console.log(user);
    return (
      <Fragment>
        <div className="navigation">
             <Link className="navigation-container" to='/'> 
               <Logo className="logo" />
             </Link>
             <div className="links-container">
                <Link  className="nav-link" to="/members">Members</Link>
                <Link  className="nav-link" to="/home/family-tree">Family Tree</Link>
                <Link  className="nav-link" to="/home/branch-list">Branches</Link>
                {user === null ? (
                  <Link className="nav-link" to="/auth">Sign In</Link>
                ) : (
                  <span className="nav-link" onClick={handleSignOut}>Sign Out</span>
                )}
            </div>
        </div>

        <Outlet />
      </Fragment>
    );
  };

  export default Navigation;