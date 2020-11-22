import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import axios from 'axios';

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
};

class EmployeeMenuItem extends React.Component{
  constructor(props){
    super(props);
    this.handleEdit=this.handleEdit.bind(this);
    this.handleAddToCart=this.handleAddToCart.bind(this);
  }
  handleEdit(){
    this.props.handleIsAvailable(this.props.title);
  }
  async handleAddToCart(){
    if(this.props.isAvailable){
      let item={
        title : this.props.title,
        subheader : this.props.subheader,
        image : this.props.image,
        description : this.props.description,
        cost : this.props.cost,
        isAvailable : this.props.isAvailable,
        noOfItems : 1
      }
      await axios.put("/additemtocart",{item : item})
      .then(res=>{
      })
      .catch(err=>{
          console.log(err);
      })
    }
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
                        <IconButton aria-label="Edit" onClick={this.handleAddToCart}>
                            <ShoppingCartIcon />
                        </IconButton>
                    {"Rs."+this.props.cost}
                    <Checkbox
                        checked={this.props.isAvailable}
                        color="primary"
                        onChange={this.handleEdit}
                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                    />
                </CardActions>  
            </Card>
        </div>
    )
  }
}
export default withStyles(styles)(EmployeeMenuItem);