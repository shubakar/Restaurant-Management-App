import React from "react";
import socketIOClient from "socket.io-client";
import Button from '@material-ui/core/Button';
import {withStyles} from "@material-ui/core/styles";
const styles={
    root : {
        marginTop:"30px",
	    marginBottom:"20px",
	
    }
};
var socket;
class Order extends React.Component{
    constructor(props){
        super(props);
        socket = socketIOClient("/");
        this.handleOrderCancel=this.handleOrderCancel.bind(this);
        this.handleOrderDelivered=this.handleOrderDelivered.bind(this);
    }
    handleOrderCancel(){
        socket.emit("cancel_order",{orderid : this.props.id, user : {username : this.props.orderBy}});
    }
    handleOrderDelivered(){
        socket.emit("delivered",{orderid : this.props.id, user : {username : this.props.orderBy}});
    }
    render(){
        const {classes}=this.props;
        const items=this.props.items.map((curValue)=><li>{curValue.title} {curValue.noOfItems}</li>);
        return(
            <div className={`container ${classes.root} bg-white border border-dark rounded rounded-lg `}>
                <p><strong>Order id:</strong> {this.props.id}</p>
                <p><strong>Status:</strong> {this.props.status}</p>
                <p><strong>OrderBy:</strong> {this.props.orderBy}</p>
                <p><strong>Deliver To:</strong> {this.props.deliverTo}</p>
                <p><strong>Bill: </strong>{this.props.bill}</p>
                <p><strong>Delivery Charge: </strong>{this.props.deliveryCharge}</p>
                <p><strong>Total Cost: {this.props.totalCost}</strong></p>
                <h6>ITEMS:</h6>
                <ul>
                   {items}
                </ul>
                {this.props.status==="Order Received" && <Button variant="contained" color="secondary" onClick={this.handleOrderCancel}>Cancel Order</Button>}
                {this.props.isEmployee &&  <Button variant="contained" color="success" onClick={this.handleOrderDelivered}>Delivered</Button>}
            </div>
        )
    }
}
export default withStyles(styles)(Order);