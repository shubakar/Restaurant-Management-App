import React from "react";
import EmployeeNavBar from "./EmployeeNavBar";
import axios from "axios";
import EmployeeSignUpDialogBox from "./EmployeeSignUpDialogBox";
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
        axios.get("/isemployeeloggedin")
        .then(res=>{
            if(res.data.isloggedin.loginstatus){
                this.props.routeProps.history.push("/employee");
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
        axios.post("/employee/signup",{user})
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
                <EmployeeNavBar />
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
                            variant="outlined"
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
                            variant="outlined"
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
                            variant="outlined"
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
                            variant="outlined"
                            value={this.state.phoneNo}
                            validators={['required']}
                            errorMessages={['this field is required']}
                        />
                    </div>
                       <Button type="submit" variant="contained" color="primary">Submit</Button>
                    </ValidatorForm>
                </div>
                {
                    this.state.dialogStatus && <EmployeeSignUpDialogBox text={this.state.dialogText} closeDialogBox={this.closeDialogBox}/>
                }
            </div>
        
        )
    }
}
export default withStyles(styles)(SignUp);