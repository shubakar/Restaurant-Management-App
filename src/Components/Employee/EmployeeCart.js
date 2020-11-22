import React from "react";
import EmployeeNavBar from "./EmployeeNavBar";
import CartItem from "../Users/CartItem";
import axios from "axios";
import socketIOClient from "socket.io-client";
import OrderDialogBox from "../Users/OrderDialogBox";
import {withStyles} from "@material-ui/styles";
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
class MyCart extends React.Component{
    constructor(props){
        super(props);
        this.state={
            items : [
                {
                    title : "",
                    subheader : "",
                    image : "https://i.ytimg.com/vi/CCab5oh0ZOc/maxresdefault.jpg",
                    description : "",
                    cost : 0,
                    isAvailable : false,
                    noOfItems : 1
                }
            ],
            dialogStatus : false,
            dialogText : ""
        };
        socket = socketIOClient("/");
        this.increaseItem=this.increaseItem.bind(this);
        this.decreaseItem=this.decreaseItem.bind(this);
        this.calculateTotalCost=this.calculateTotalCost.bind(this);
        this.palceOrder=this.palceOrder.bind(this);
        this.closeDialogBox=this.closeDialogBox.bind(this);
        this.handleLogout=this.handleLogout.bind(this);
    }
    componentDidMount(){
        this.APICall();
        socket.on("order_response",(res)=>{
            var text="";
            if(res.data==="success"){
                text = "Order Placed";
            }
            else{
                text="Some error has Occured. Please tyr Later";
            }
            this.setState({dialogStatus : true,dialogText : text});
        })
    }
    componentDidUpdate(){
        this.updateMyCartAPICall();
    }
    componentWillUnmount(){
        socket.off("order_response");
    }
    async updateMyCartAPICall(){
        await axios.put("/mycart",{myCart:this.state.items}).then((response)=>{
        }).catch((err)=>{
            console.log(err);
        })
    }
    async APICall(){
        await axios.get("/mycart").then((response)=>{
            if(response.data.isloggedin.loginstatus){
                this.setState({items:response.data.myCart, isLoggedIn : response.data.isloggedin.loginstatus, username : response.data.isloggedin.username});
            }
            else{
                this.props.routeProps.history.push("/employee/login");
            }
        }).catch((err)=>{
            console.log(err);
        })
    }
    increaseItem(name){
        const items=this.state.items;
        let len=items.length;
        for(let i=0; i<len;i++){
            if(name==items[i].title){
                items[i].noOfItems+=1;
                this.setState({items : items});
                break;
            }
        }
    }
    deleteItemFromCart(name,items){
        let newitems= items.filter(curValue=>(curValue.title!=name));
        return newitems;
    }
    decreaseItem(name){
        let items=this.state.items;
        let len =items.length;
        for(let i=0;i<len;i++){
            if(name==items[i].title){
                items[i].noOfItems-=1;
                if(items[i].noOfItems<=0){
                    items=this.deleteItemFromCart(items[i].title, items);
                }
                this.setState({items:items});
                break;
            }
        }
    }
    calculateTotalCost(){
        let totalCost=0;
        let items=this.state.items;
        let len=items.length;
        for(let i=0;i<len;i++){
            totalCost+=(items[i].cost*items[i].noOfItems);
        }
        return totalCost;
    }
    async palceOrder(){
        let cost=this.calculateTotalCost();
        let order={
            bill : cost,
            deliveryCharge : 0,
            totalCost : cost,
			items : this.state.items
        }
        socket.emit("place_order",{order : order, user : {username : this.state.username}});
    }
    closeDialogBox(){
        let newState={
            items : [
            ]
        }
        this.setState({items : newState.items, dialogStatus :false, dialogStatus : ""})
    }
    handleLogout(){
        axios.get("/logout")
        .then(res=>{
            this.setState({isLoggedIn : false, username : ""});
            this.props.routeProps.history.push("/employee/login");
        })
        .catch(err=>{
            console.log(err);
        })
    }
    render(){
        const {classes}=this.props;
        const myCart=this.state.items.map(curValue=><CartItem image={curValue.image} title={curValue.title} key={ curValue.title} subheader={curValue.subheader} description={curValue.description} cost={curValue.cost} noOfItems={curValue.noOfItems} increaseItem={this.increaseItem} decreaseItem={this.decreaseItem}/>)
        return(
            <div className={classes.root}>
                <EmployeeNavBar isLoggedIn={this.state.isLoggedIn} username={this.state.username} handleLogout={this.handleLogout}/>
                <div className="container">
  	                <div className="row">
                        {myCart}
                    </div>
                </div >
                <div className={`container ${classes.bill}`}>
                    <h5>Bill : {this.calculateTotalCost()}</h5>
                    <h5>Delivery charge : 0.00</h5>
                    <h5>Total Cost : {this.calculateTotalCost()}</h5>
                    <button type="button" class="btn btn-success" onClick={this.palceOrder}>Place Order</button>
                </div>
                {
                    this.state.dialogStatus && <OrderDialogBox text={this.state.dialogText} closeDialogBox={this.closeDialogBox}/>
                }
            </div>
        )
    }
}
export default withStyles(styles)(MyCart);