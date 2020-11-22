import React from "react";
import AdminNavBar from "./AdminNavBar";
import axios from "axios";
import { withStyles } from '@material-ui/core/styles';
import AdminMenuItem from "./AdminMenuItem";
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
class AdminMenu extends React.Component{
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
        this.handleDelete=this.handleDelete.bind(this);
        this.handleIsAvailable=this.handleIsAvailable.bind(this);
        this.handleLogout=this.handleLogout.bind(this);
    }
    componentDidMount(){
        this.APICall()
    }
    handleIsAvailable(item){
        let url=`/employee/isAvailable/${item}`;
        axios.put(url,{item})
        .then(response=>{
            this.APICall();
        })
        .catch(err=>{
            console.log(err);
        })
    }
    async APICall(){
        await axios.get("/admin/menu")
        .then(response=>{
            if(response.data.isloggedin.loginstatus){
                this.setState({menu : response.data.response, isLoggedIn : response.data.isloggedin.loginstatus, username : response.data.isloggedin.username});
            }
            else{
                this.props.routeProps.history.push("/admin/login");
            }
        })
        .catch(err=>{
            console.log(err);
        })
    }
    async handleDelete(title){
        let url=`/admin/delete/${title}`;
        await axios.delete(url)
        .then(response=>{
            this.APICall();
        })
        .catch(err=>{
            console.log(err);
        })
    }
    handleLogout(){
        axios.get("/logout")
        .then(res=>{
            this.setState({menu : [], isLoggedIn : false, username : ""});
            this.props.routeProps.history.push("/admin/login");
        })
        .catch(err=>{
            console.log(err);
        })
    }
    render(){
        const {classes}=this.props;
        const menu=this.state.menu.map((curValue)=><AdminMenuItem image={curValue.image} title={curValue.title} key={ curValue.title} subheader={curValue.subheader} description={curValue.description} cost={curValue.cost} isAvailable={curValue.isAvailable} handleDelete={this.handleDelete}  handleIsAvailable={this.handleIsAvailable}/>);
        return(
            <div className={classes.root}>
                <AdminNavBar isLoggedIn={this.state.isLoggedIn} username={this.state.username} handleLogout={this.handleLogout}/>
                <div className="container">
  	                <div className="row">
                        {menu}
                    </div>
                </div>
            </div>
        )
    }
}
export default withStyles(styles)(AdminMenu);