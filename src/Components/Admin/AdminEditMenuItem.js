import React from "react";
import axios from "axios";
import Button from '@material-ui/core/Button';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import AdminNavBar from "./AdminNavBar";
import NewMenuItemDialogBox from "./NewMenuItemDialogBox";
import {withStyles} from "@material-ui/core/styles";
import Background from "../../NewMenuBackgroundImage.jpg";
const styles={
    root: {
        background: `url(${Background})`,
        backgroundSize : 'cover',
        backgroundRepeat : 'no-repeat',
        backgroundPosition : "center",
        height : "100vh",
        
    },
    textField : {
        marginBottom : "10px",
        color : "white"
    }
  };
class AddItemToMenu extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            menuItem : {
                title : "",
                subheader : "",
                image : "",
                description : "",
                cost : "",
                isAvailable : true,
            },
            dialogState : false,
            text : "",
            initialTitle : this.props.routeProps.match.params.item
        }
        this.handleChange=this.handleChange.bind(this);
        this.handleSubmit=this.handleSubmit.bind(this);
        this.closeDialogBox=this.closeDialogBox.bind(this);
        this.APICall=this.APICall.bind(this);
    }
    componentDidMount(){
      this.APICall();
    }
    async APICall(){
      let url=`/admin/editmenuitem/${this.state.initialTitle}`;
      await axios.get(url)
      .then(response=>{
        let menuItem={
          title : response.data.response[0].title,
          subheader : response.data.response[0].subheader,
          image : response.data.response[0].image,
          description : response.data.response[0].description,
          cost : response.data.response[0].cost,
          isAvailable : response.data.response[0].isAvailable,
        }
        this.setState({menuItem : menuItem});
      })
      .catch(err=>{
        console.log(err);
      })
    }
    handleChange = (event) => {
        const  menuItem  = this.state.menuItem;
        menuItem[event.target.name] = event.target.value;
        this.setState({ menuItem : menuItem });
    }
    handleSubmit(){
        const menuItem=this.state.menuItem;
        let url=`/admin/editmenuitem/${this.state.initialTitle}`;
        axios.put(url,{menuItem}).then(response=>{
            const data=response.data;
            var text=""
            if(data==="success"){
                text="Menu Item Edited Successfully";
            }
            else if(data==="error"){
                text="Some error has occured. Please try Later";
            }
            else{
                text="Item title must be Unique";
            }
            this.setState({dialogState : true,text: text})
        })
        .catch(err=>{
            console.log(err);
        });
    }
    closeDialogBox(){
        let menu=this.state;
    }
    render(){
        const {classes} = this.props;
        return(
            <div className={classes.root}>
                <AdminNavBar />
                <div className="container">
                    <h1>Edit Menu Item</h1>
                    <ValidatorForm
                        ref="form"
                        onSubmit={this.handleSubmit}
                        onError={errors => console.log(errors)}
                    >
                        <div className={classes.textField}>
                            <TextValidator
                                label="Title"
                                name="title"
                                value={this.state.menuItem.title}
                                onChange={this.handleChange}
                                variant="outlined"
                                validators={['required']}
                                errorMessages={['this field is required']}
                            />
                        </div>
                        <div className={classes.textField}>
                            <TextValidator
                            label="Subheader"
                            name="subheader"
                            value={this.state.menuItem.subheader}
                            onChange={this.handleChange}
                            variant="outlined"
                            validators={['required']}
                            errorMessages={['this field is required']}
                        />
                        </div>
                        <div className={classes.textField}>
                            <TextValidator
                            label="Image URL"
                            name="image"
                            value={this.state.menuItem.image}
                            onChange={this.handleChange}
                            variant="outlined"
                            validators={['required']}
                            errorMessages={['this field is required']}
                        />
                        </div>
                        <div className={classes.textField}>
                            <TextValidator
                            label="Description"
                            name="description"
                            value={this.state.menuItem.description}
                            onChange={this.handleChange}
                            variant="outlined"
                            multiline
                            validators={['required']}
                            errorMessages={['this field is required']}
                        />
                        </div>
                        <div className={classes.textField}>
                            <TextValidator
                            label="Cost"
                            name="cost"
                            value={this.state.menuItem.cost}
                            onChange={this.handleChange}
                            variant="outlined"
                            validators={['required']}
                            errorMessages={['this field is required']}
                        />
                        </div>
                        <Button type="submit" variant="contained" color="primary">Submit</Button>
                    </ValidatorForm>
                </div>
                {   this.state.dialogState &&
                    <NewMenuItemDialogBox  text={this.state.text} closeDialogBox={this.closeDialogBox}/>
                }
            </div>
        )
    }
}
export default withStyles(styles)(AddItemToMenu);