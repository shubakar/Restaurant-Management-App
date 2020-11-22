import React from "react";
import axios from "axios";
import {withStyles} from "@material-ui/core/styles";
import AdminNavBar from "./AdminNavBar";
import Order from "../Users/Order";
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
class AdminUserOrders extends React.Component{
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
        this.handleLogout=this.handleLogout.bind(this);
    }
    componentDidMount(){
        this.APICall();
    }
    
    APICall(){
        let url=`/admin/orders/${this.props.routeProps.match.params.user}`
        axios.get(url)
        .then(res=>{
            if(res.data.isloggedin.loginstatus===false){
                this.props.routeProps.history.push("/admin/login");
            }
            else{
                this.setState({orders : res.data.orders, isLoggedIn : res.data.isloggedin.loginstatus ,username : res.data.isloggedin.username});
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
        this.props.routeProps.history.push("/admin/login");
        })
        .catch(err=>{
            console.log(err);
        })
    }
    render(){
        const {classes}=this.props;
        let orders=this.state.orders.map(curValue=><Order  id={curValue._id} bill={curValue.bill} deliveryCharge={curValue.deliveryCharge} totalCost={curValue.totalCost} items={curValue.items} key={curValue._id} status={curValue.status} deliverTo={curValue.deliverTo} orderBy={curValue.orderBy}/>)
        return (
            <div className={classes.root}>
                <AdminNavBar isLoggedIn={this.state.isLoggedIn} username={this.state.username} handleLogout={this.handleLogout}/>
                {orders}
            </div>
        )
    }
}
export default withStyles(styles)(AdminUserOrders);