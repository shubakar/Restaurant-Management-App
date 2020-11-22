import React from "react";
import AdminNavBar from "./AdminNavBar";
import axios from "axios";
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Button from '@material-ui/core/Button';
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
    textfield : {
        marginBottom : "10px",
        color : "white"
    }
};
class Login extends React.Component{
    constructor(props){
        super(props);
        this.state={
            username : "",
            password : "",

        }
        this.handleChange=this.handleChange.bind(this);
        this.handleSubmit=this.handleSubmit.bind(this);
        this.closeDialogBox=this.closeDialogBox.bind(this);
        this.logInRedirect=this.logInRedirect.bind(this);
    }
    logInRedirect(){
        this.props.routeProps.history.push("/admin");
    }
    componentDidMount(){
        axios.get("/isadminloggedin")
        .then(res=>{
            if(res.data.isloggedin.loginstatus){
               this.logInRedirect();
            }
        })
        .catch(err=>{
            console.log(err);
        })
    }
    handleChange = (event) => {
        const  user  = this.state;
        user[event.target.name] = event.target.value;
        this.setState(user);
    }
    handleSubmit(){
        let user=this.state;
        axios.post("/admin/login",user)
        .then(res=>{
            if(res.data.isloggedin.loginstatus){
                this.logInRedirect();
            }
        })
        .catch(err=>{
            console.log(err);
        })
    }
    closeDialogBox(){
        this.setState({
            username : "",
            password : "",
        });
    }
    render(){
        const {classes}=this.props;
        return(
            <div className={classes.root}>
                <AdminNavBar />
                <div className={`container`}>
                    <ValidatorForm
                        ref="form"
                        onSubmit={this.handleSubmit}
                    >
                    <div className={classes.textfield}>
                        <TextValidator
                            onChange={this.handleChange}
                            name="username"
                            label="User Id"
                            variant="outlined"
                            value={this.state.username}
                            validators={['required', 'isEmail']}
                            errorMessages={['this field is required', 'email is not valid']}
                        />
                    </div>
                    <div className={classes.textfield}>
                        <TextValidator
                            onChange={this.handleChange}
                            name="password"
                            label="Password"
                            variant="outlined"
                            value={this.state.password}
                            type="password"
                            validators={['required']}
                            errorMessages={['this field is required']}
                        />
                    </div>
                       <Button type="submit" variant="contained" color="primary">Submit</Button>
                    </ValidatorForm>
                </div>
            </div>
        
        )
    }
}
export default withStyles(styles)(Login);