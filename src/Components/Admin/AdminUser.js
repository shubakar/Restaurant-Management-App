import React from "react";
import Checkbox from '@material-ui/core/Checkbox';
import Button from "@material-ui/core/Button";
import {withStyles} from "@material-ui/core/styles";
const styles={
    root : {
        marginTop:"30px",
        marginBottom:"20px",
        padding : "10px"
	
    }
};
class AdminUser extends React.Component{
    constructor(props){
        super(props);
        this.handleOrders=this.handleOrders.bind(this);
        this.handleBlocked=this.handleBlocked.bind(this);
    }
    handleOrders(){
        this.props.handleOrders(this.props.username);
    }
    handleBlocked(){
        this.props.handleBlocked(this.props.username);
    }
    render(){
        const {classes}=this.props;
        return(
            <div className={`container ${classes.root} bg-white border border-dark rounded rounded-lg `}>
                <h6>{this.props.username}</h6>
                <Checkbox
                    checked={this.props.isBlocked}
                    indeterminate
                    inputProps={{ 'aria-label': 'Blocked' }}
                    onClick={this.handleBlocked}
                />
                <Button variant="contained" color="secondary" onClick={this.handleOrders}>
                    Orders
                </Button>
            </div>
            
        )
    }
}
export default withStyles(styles)(AdminUser);