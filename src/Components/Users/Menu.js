import React from "react";
import NavBar from "./NavBar";
import axios from "axios";
import { withStyles } from '@material-ui/core/styles';
import MenuItem from "./MenuItem";
import Background from "./MenuPageBackground.jpg";
const styles ={
    root : {
        background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${Background})`,
        backgroundSize : 'cover',
        backgroundRepeat : 'no-repeat',
        backgroundPosition : "center",
        backgroundAttachment: "fixed"
    }
};
class Menu extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            menu : [
                {
                    title : "",
                    subheader : "",
                    image : "",
                    description : "",
                    cost : 0,
                    isAvailable : false
                },
            ],
            isLoggedIn : false,
            username : ""
        }
        this.handleLogout=this.handleLogout.bind(this);
    }
    componentDidMount(){
        const menu=this.APICall()
    }
    componentDidUpdate(){
        this.APICall();
    }
    APICall(){
        axios.get("/menu")
        .then(response=>{
            this.setState({menu : response.data.response, isLoggedIn : response.data.isloggedin.loginstatus, username : response.data.isloggedin.username});
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
        const {classes}=this.props;
        const menu=this.state.menu.map((curValue)=><MenuItem image={curValue.image} title={curValue.title} key={ curValue.title} subheader={curValue.subheader} description={curValue.description} cost={curValue.cost} isAvailable={curValue.isAvailable} routeProps={this.props.routeProps} isLoggedIn={this.state.isLoggedIn}/>);
        return(
            <div className={classes.root}>
                <NavBar isLoggedIn={this.state.isLoggedIn} username={this.state.username} handleLogout={this.handleLogout}/>
                <div className="container">
  	                <div className="row">
                        {menu}
                    </div>
                </div>
            </div>
        )
    }
}
export default withStyles(styles)(Menu);