import React from "react";
import NavBar from "./NavBar";
import Background from "./homepage.jpg";
import axios from "axios";
import "../../Home.css";
const style={
    background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${Background})`,
    backgroundSize : 'cover',
    backgroundRepeat : 'no-repeat',
    height : "100vh",
    backgroundPosition : "center"
}
class Home extends React.Component{
    constructor(props){
        super(props);
        this.state={
            isLoggedIn :false,
            username : ""
        }
        this.handleLogout=this.handleLogout.bind(this);
        this.APICall=this.APICall.bind(this);
    }
    componentDidMount(){
        this.APICall();
    }
    APICall(){
        axios.get("/isloggedin")
        .then(res=>{
            this.setState({isLoggedIn : res.data.isloggedin.loginstatus, username : res.data.isloggedin.username})
        })
        .catch(err=>{
            console.log(err);
        })
    }
    handleLogout(){
        axios.get("/logout")
        .then(res=>{
            this.setState({isLoggedIn : false, username : ""});
        })
        .catch(err=>{
            console.log(err);
        })
    }
    render(){
        return(
            <div style={style}>
                <NavBar isLoggedIn={this.state.isLoggedIn} username={this.state.username} handleLogout={this.handleLogout}/>
                <div class="card text-center">
                    <div className="card-body">
                        <h5 className="card-title display-1 title">Restaurent Title</h5>
                        <p className="card-text">MERN Stack Restaurent Managment System</p>
                    </div>
                </div>
                <div class="card-deck">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Shubakar Poda</h5>
                            <p class="card-text">This is a MERN Stack Responsive WebSite. Features like SignUP and Login, Frontend Routing are Implemented.</p>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Kranthi Kiran Konuri</h5>
                            <p class="card-text">Libraries Like BootStrap4, Material-UI are used. ExpressJs and SocketIO are used in BackEnd.</p>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Ajaz</h5>
                            <p class="card-text">There are four Views(Customer, Employee, Chef and Admin). A customer can Register, Login, Look at the menu, can add item to Cart, can place an order and cancel it.</p>
                        </div>
                    </div>
                </div>
            </div>
            
        )
    }
}
export default Home;