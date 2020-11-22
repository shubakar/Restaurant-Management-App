import React from "react";
import NavBar from "./NavBar";
import axios from "axios";
import SignUpDialogBox from "./SignUpDialogBox";
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Button from '@material-ui/core/Button';
import {withStyles} from "@material-ui/core/styles";
import Background from "./MenuPageBackground.jpg";
const styles ={
    root : {
        background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${Background})`,
        backgroundSize : 'cover',
        backgroundRepeat : 'no-repeat',
        backgroundPosition : "center",
        backgroundAttachment: "fixed",
        height : "100vh"
    },
    textfield : {
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        borderRadius: 3,
        border: 0,
        color: 'white',
        padding: '0 30px',
        width : "300px",
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        marginBottom : "30px"
    }
};
class SignUp extends React.Component{
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
        this.props.routeProps.history.push("/menu");
    }
    componentDidMount(){
        axios.get("/login")
        .then(res=>{
            if(res.data.status){
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
        axios.post("/login",user)
        .then(res=>{
            if(res.data.status){
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
                <NavBar />
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
                            value={this.state.password}
                            type="password"
                            validators={['required']}
                            errorMessages={['this field is required']}
                        />
                    </div>
                       <Button type="submit" variant="contained" color="primary">Submit</Button>
                    </ValidatorForm>
                </div>
                {
                    this.state.dialogStatus && <SignUpDialogBox text={this.state.dialogText} closeDialogBox={this.closeDialogBox}/>
                }
            </div>
        
        )
    }
}
export default withStyles(styles)(SignUp);