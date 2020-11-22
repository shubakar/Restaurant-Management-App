import { Button } from "@material-ui/core";
import React from "react";
import {Link} from "react-router-dom";
class AdminNavBar extends React.Component{
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
              <Link to="/admin" className="navbar-brand h1">Admin</Link>
              <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse justify-content-between " id="navbarNavAltMarkup">
                <div className="navbar-nav">
                  <Link to="/admin/menu" className="nav-item nav-link active" >Menu</Link>
                  <Link to="/admin/additemtomenu" className="nav-item nav-link active">New Item</Link>
                  <Link to="/admin/orders" className="nav-item nav-link active">Orders</Link>
                </div>
                <div className="navbar-nav">
                  {!this.props.isLoggedIn ?<Link className="nav-item nav-link active" to="/admin/login">Login</Link>:this.props.username}
                  {this.props.isLoggedIn && <Button variant="contained" onClick={this.handleLogout}>Logout</Button>}
                </div>
              </div>
            </nav>
        )
    }
}
export default AdminNavBar;