import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class AlertDialog extends React.Component {
    static defaultProps={
        open : true
    }
    constructor(props){
        super(props);
        this.state={
            open : this.props.open
        }
        this.handleClose=this.handleClose.bind(this);
        this.handleClickOpen=this.handleClickOpen.bind(this);
    }
    handleClickOpen (){
        this.setState({open:true});
    };
    handleClose(){
        this.setState({open:false});
        this.props.closeDialogBox();
    };
  render(){
    return (
        <div>
            <Dialog
                open={this.state.open}
                onClose={this.handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"SignUp Status"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {this.props.text}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}}
export default AlertDialog;