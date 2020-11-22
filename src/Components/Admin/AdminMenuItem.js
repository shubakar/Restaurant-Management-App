import React from 'react';
import {Link} from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';

const styles = {
  root: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  menuItem : {
    marginBottom : "50px"
  },
  avatar: {
    backgroundColor: red[500],
  },
  deleteIcon : {
    marginLeft : "auto"
  }
}

class AdminMenuItem extends React.Component{
  constructor(props){
    super(props);
    this.handleEdit=this.handleEdit.bind(this);
    this.handleDelete=this.handleDelete.bind(this);
  }
  handleEdit(){
    this.props.handleIsAvailable(this.props.title);
  }
  handleDelete(){
    this.props.handleDelete(this.props.title);
  }
  render(){
    const {classes} = this.props;
    return (
      <div className={`col-sm-12 col-md-6 col-lg-4 ${classes.menuItem}`}>
        <Card className={classes.root}>
          <CardHeader
            title={this.props.title}
            subheader={this.props.subheader}
          />
          <CardMedia
            className={classes.media}
            image={this.props.image}
            title="Paella dish"
          />
          <CardContent>
            <Typography variant="body2" color="textSecondary" component="p">
              {this.props.description}
            </Typography>
          </CardContent>
          <CardActions disableSpacing>
            <Link to={`/admin/editmenuitem/${this.props.title}`}>
              <IconButton aria-label="Edit">
                <EditIcon />
              </IconButton>
            </Link>
            {"Rs."+this.props.cost}
            <Checkbox
              checked={this.props.isAvailable}
              color="primary"
              onChange={this.handleEdit}
              inputProps={{ 'aria-label': 'secondary checkbox' }}
            />
            <IconButton aria-label="Delete" className={classes.deleteIcon} onClick={this.handleDelete}>
              <DeleteIcon />
            </IconButton>
          </CardActions>  
        </Card>
      </div>
    );
  }
}
export default withStyles(styles)(AdminMenuItem);