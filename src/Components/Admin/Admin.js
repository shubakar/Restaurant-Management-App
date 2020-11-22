import React from "react";
import AdminNavbar from "./AdminNavBar";
import AdminUser from "./AdminUser";
import axios from "axios";
import {withStyles} from "@material-ui/core/styles";
import Background from "../../NewMenuBackgroundImage.jpg";
const styles={
    root: {
        background: `url(${Background})`,
        backgroundSize : 'cover',
        backgroundRepeat : 'no-repeat',
        backgroundPosition : "center",
        height : "100vh",
        
    },
}
class Admin extends React.Component{
    constructor(props){
        super(props);
        this.state={
            users : [
            ],
            isLoggedIn : false,
            username : ""
        }
        this.handleLogout=this.handleLogout.bind(this);
        this.handleBlocked=this.handleBlocked.bind(this);
        this.handleOrders=this.handleOrders.bind(this);
    }
    componentDidMount(){
        this.APICall();
    }
    APICall(){
        axios.get("/admin/users")
        .then(res=>{
            if(res.data.isloggedin.loginstatus){
                this.setState({users : res.data.users, isLoggedIn : res.data.isloggedin.loginstatus, username : res.data.isloggedin.username});
            }
            else{
                this.props.routeProps.history.push("/admin/login");
            }
        })
        .catch(err=>{
            console.log(err);
        })
    }
    handleLogout(){
        axios.get("/logout")
        .then(res=>{
            this.props.routeProps.history.push("/admin/login")
        })
        .catch(err=>{
            console.log(err);
        })
    }
    handleBlocked(user){
        let url=`/admin/updateuserblockedstatus/${user}`;
        axios.put(url)
        .then(res=>{
            this.APICall()
        })
        .catch(err=>{
            console.log(err);
        })
    }
    handleOrders(username){
        let url=`/admin/orders/${username}`;
        this.props.routeProps.history.push(url);
    }
    render(){
        const {classes}=this.props;
        let users=this.state.users.map((curValue)=><AdminUser username={curValue.username} key={curValue.username} isBlocked={curValue.isBlocked} handleBlocked={this.handleBlocked} handleOrders={this.handleOrders}/>);
        return(
        <div className={classes.root}>
            <AdminNavbar isLoggedIn={this.state.isLoggedIn} username={this.state.username} handleLogout={this.handleLogout} />
            {users}
        </div>
        )
    }
}
export default withStyles(styles)(Admin);