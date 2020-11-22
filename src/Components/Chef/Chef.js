import React from "react";
import socketIOClient from "socket.io-client";
import ChefNavBar from "./ChefNavBar";
import EmployeeOrder from "../Employee/EmployeeOrder";
import axios from "axios";
import {withStyles} from "@material-ui/core/styles";
import Background from "../../NewMenuBackgroundImage.jpg";
const styles ={
    root : {
        background: `url(${Background})`,
        backgroundSize : 'cover',
        backgroundRepeat : 'no-repeat',
        backgroundPosition : "center",
        backgroundAttachment: "fixed",
        height : "100vh"
    },
};
var socket;
class Chef extends React.Component{
    constructor(props){
        super(props);
        this.state={
            orders : [],
            isLoggedIn : false,
            username : ""
        }
        socket = socketIOClient("/");
        this.handleLogout=this.handleLogout.bind(this);
    }
    componentDidMount() {
        axios.get("/ischefloggedin")
        .then(res=>{
            if(!res.data.isloggedin.loginstatus){
                this.props.routeProps.history.push("/chef/login");
            }
            else{
                this.setState({isLoggedIn : true, username : res.data.isloggedin.username});
                socket.on("live_orders",(req)=>{
                    this.setState({orders : req.liveOrders});
                })
                socket.on("updated_orders",(orders)=>{
                    this.setState({orders : orders.liveOrders});
                })
            }
        })
      }
      componentWillUnmount() {
        socket.off("live_orders", this.getData);
        socket.off("updated_orders");
      }
    handleLogout(){
        axios.get("/logout")
        .then(res=>{
            this.setState({isLoggedIn : false, username : ""});
            this.props.routeProps.history.push("/chef/login");
        })
        .catch(err=>{
            console.log(err);
        })
    }
    render(){
        const {classes}=this.props;
        let orders=this.state.orders.map(curValue=><EmployeeOrder  id={curValue._id} bill={curValue.bill} deliveryCharge={curValue.deliveryCharge} totalCost={curValue.totalCost}  items={curValue.items} key={curValue._id} status={curValue.status} deliverTo={curValue.deliverTo} items={curValue.items} key={curValue._id} status={curValue.status} deliverTo={curValue.deliverTo} orderBy={curValue.orderBy}/>)
        return (
            <div className={classes.root}>
                <ChefNavBar isLoggedIn={this.state.isLoggedIn} username={this.state.username} handleLogout={this.handleLogout}/>
                {orders}
            </div>
        )
    }
}
export default withStyles(styles)(Chef);