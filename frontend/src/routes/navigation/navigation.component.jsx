import { Link, Outlet } from "react-router-dom";
import { Fragment } from "react";
import "./navigation.styles.scss";
import { ReactComponent as Logo } from "../../assets/logo.svg";
  


const Navigation = () => {
    return (
      <Fragment>
        <div className="navigation">
             <Link className="navigation-container" to='/'> 
               <Logo className="logo" />
             </Link>
             <div className="links-container">
                <Link  className="nav-link" to="/">Dashboard</Link>
                <Link  className="nav-link" to="/members">Members</Link>
                <Link  className="nav-link" to="/family-tree">Family Tree</Link>
                <Link  className="nav-link" to="/sign-in">Sign In</Link>
            </div>
        </div>

        <Outlet />
      </Fragment>
    );
  };

  export default Navigation;