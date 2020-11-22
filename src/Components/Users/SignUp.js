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
            userName : "",
            password : "",
            address : "",
            phoneNo : "",
            dialogStatus : false,
            dialogText : "",

        }
        this.handleChange=this.handleChange.bind(this);
        this.handleSubmit=this.handleSubmit.bind(this);
        this.closeDialogBox=this.closeDialogBox.bind(this);
    }
    componentDidMount(){
        axios.get("/isloggedin")
        .then(res=>{
            if(res.data.isloggedin.loginstatus){
                this.props.routeProps.history.push("/menu");
            }
        })
    }
    handleChange = (event) => {
        const  user  = this.state;
        user[event.target.name] = event.target.value;
        this.setState(user);
    }
    handleSubmit(){
        let user=this.state;
        axios.post("/signup",{user})
        .then(res=>{
            let dialogText="";
            if(res.data==="error"){
                dialogText="Some Error has Occured. Please tyr Later";
            }
            else if(res.data==="success"){
                dialogText="Successfully Signed Up. Please Login."
            }
            else{
                dialogText="User Name already resistered."
            }
            this.setState({dialogText : dialogText, dialogStatus : true});
        })
        .catch(err=>{
            console.log(err);
        })
    }
    closeDialogBox(){
        this.setState({
            userName : "",
            password : "",
            address : "",
            phoneNo : "",
            dialogStatus : false,
            dialogText : "",
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
                            name="userName"
                            label="User Id"
                            value={this.state.userName}
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
                    <div className={classes.textfield}>
                        <TextValidator
                            onChange={this.handleChange}
                            name="address"
                            label="Address"
                            value={this.state.address}
                            multiline
                            validators={['required']}
                            errorMessages={['this field is required']}
                        />
                    </div>
                    <div className={classes.textfield}>
                        <TextValidator
                            onChange={this.handleChange}
                            name="phoneNo"
                            label="Phone Number"
                            value={this.state.phoneNo}
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