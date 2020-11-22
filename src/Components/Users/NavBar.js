import { Button } from "@material-ui/core";
import React from "react";
import {Link} from "react-router-dom";
class NavBar extends React.Component{
    constructor(props){
      super(props);
      this.handleLogout=this.handleLogout.bind(this);
    }
    handleLogout(){
      this.props.handleLogout();
    }
    render(){
        return(
            <nav className="navbar navbar-expand-lg navbar-dark ">
              <Link to="/" className="navbar-brand h1">Navbar</Link>
              <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse justify-content-between " id="navbarNavAltMarkup">
                <div className="navbar-nav">
                  <Link to="/menu" className="nav-item nav-link active" >Menu</Link>
                  <Link to="/myorders" className="nav-item nav-link active">My Orders</Link>
                  <Link to="/mycart" className="nav-item nav-link active">My Cart</Link>
                </div>
                <div className="navbar-nav">
                  { !this.props.isLoggedIn?<Link to="/login" className="nav-item nav-link active" >Login</Link>:<div className="nav-item nav-link active">{this.props.username}</div>}
                   { !this.props.isLoggedIn?<Link to="/signup" className="nav-item nav-link active" >SignUp</Link>:<Button className="nav-item nav-link active" onClick={this.handleLogout}>Logout</Button>}
                </div>
              </div>
            </nav>
        )
    }
}
export default NavBar;