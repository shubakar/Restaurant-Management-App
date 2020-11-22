import React from "react";
import axios from "axios";
import socketIOClient from "socket.io-client";
import {withStyles} from "@material-ui/core/styles";
import EmployeeNavBar from "./EmployeeNavBar";
import EmployeeOrderItem from "./EmployeeOrder";
import Background from "../../NewMenuBackgroundImage.jpg";
const styles ={
    root : {
        background: `url(${Background})`,
        backgroundSize : 'cover',
        backgroundRepeat : 'no-repeat',
        backgroundPosition : "center",
        backgroundAttachment: "fixed"
    }
};
var socket;
class EmployeeOrder extends React.Component{
    constructor(props){
        super(props);
        this.state={
            orders : [{
                    _id : "",
                    bill : 0.00,
                    deliveryCharge : 0.00,
                    totalCost : 0.00,
                    items : [
                        {
                            title : "",
                            noOfItems : 0,
                        }
                    ]
                }

            ],
            isLoggedIn : false,
            username : ""
        }
        socket = socketIOClient("/");
        this.handleLogout=this.handleLogout.bind(this);
    }
    componentDidMount(){
        this.APICall();
        socket.on("updated_orders",(orders)=>{
            this.setState({orders : orders.liveOrders});
        })
    }
    componentWillUnmount(){
        socket.off("live_orders");
        socket.off("updated_orders");
    }
    APICall(){
        axios.get("/myorders")
        .then(res=>{
            if(res.data.isloggedin.loginstatus===false){
                this.props.routeProps.history.push("/employee/login");
            }
            else{
                socket.on("live_orders",(orders)=>{
                    this.setState({orders : orders.liveOrders, isLoggedIn : res.data.isloggedin.loginstatus ,username : res.data.isloggedin.username});
                })
            }
        })
        .catch(err=>{
            console.log(err);
        })
    }
    handleLogout(){
        axios.get("/logout")
        .then(res=>{
            let orders= [{
                _id : "",
                bill : 0.00,
                deliveryCharge : 0.00,
                totalCost : 0.00,
                items : [
                    {
                        title : "",
                        noOfItems : 0,
                    }
                ]
            }
        ];
        this.setState({orders : orders, isLoggedIn : false, username : ""});
        this.props.routeProps.history.push("/employee/login");
        })
        .catch(err=>{
            console.log(err);
        })
    }
    render(){
        const {classes}=this.props;
        let orders=this.state.orders.map(curValue=><EmployeeOrderItem  id={curValue._id} bill={curValue.bill} deliveryCharge={curValue.deliveryCharge} totalCost={curValue.totalCost}  items={curValue.items} key={curValue._id} status={curValue.status} deliverTo={curValue.deliverTo} items={curValue.items} key={curValue._id} status={curValue.status} deliverTo={curValue.deliverTo} orderBy={curValue.orderBy} isEmployee={true}/>)
        return (
            <div className={classes.root}>
                <EmployeeNavBar isLoggedIn={this.state.isLoggedIn} username={this.state.username} handleLogout={this.handleLogout}/>
                {orders}
            </div>
        )
    }
}
export default withStyles(styles)(EmployeeOrder);