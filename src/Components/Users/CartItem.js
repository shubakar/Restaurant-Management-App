import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
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
  rightSideContent : {
      marginLeft : "auto",
  }
}

class CartItem extends React.Component{
    constructor(props){
        super(props);
        this.increaseItem=this.increaseItem.bind(this);
        this.decreaseItem=this.decreaseItem.bind(this);
    }
  increaseItem(){
      this.props.increaseItem(this.props.title);
  }
  decreaseItem(){
    this.props.decreaseItem(this.props.title);
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
            {"Rs."+this.props.cost+"   "}
            <IconButton aria-label="Decrease item by one" className={classes.rightSideContent} onClick={this.decreaseItem}>
              <RemoveIcon />
            </IconButton>
            {this.props.noOfItems}
            <IconButton aria-label="Increase item by one" onClick={this.increaseItem}>
              <AddIcon />
            </IconButton>
          </CardActions>  
        </Card>
      </div>
    );
  }
}
export default withStyles(styles)(CartItem);