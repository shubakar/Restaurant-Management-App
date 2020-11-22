import { Button } from "@material-ui/core";
import React from "react";
import {Link} from "react-router-dom";
class EmployeeNavBar extends React.Component{
    constructor(props){
      super(props);
      this.handleLogout=this.handleLogout.bind(this);
    }
    handleLogout(){
      this.props.handleLogout();
    }
    render(){
        return(
            <nav className="navbar navbar-expand-lg navbar-light ">
              <Link to="/employee" className="navbar-brand h1" >Employee</Link>
              <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse justify-content-between " id="navbarNavAltMarkup">
                <div className="navbar-nav">
                  <Link to="/employee/cart" className="nav-item nav-link active" >Cart</Link>
                  <Link to="/employee/orders" className="nav-item nav-link active">Orders</Link>
                </div>
                <div className="navbar-nav">
                  {!this.props.isLoggedIn ? <Link className="nav-item nav-link active" to="/employee/login">Login</Link> : this.props.username}
                  {!this.props.isLoggedIn ? <Link className="nav-item nav-link active" to="/employee/signup">SignUp</Link> : <Button onClick={this.handleLogout}>Logout</Button>}
                </div>
              </div>
            </nav>
        )
    }
}
export default EmployeeNavBar;