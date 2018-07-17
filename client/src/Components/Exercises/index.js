import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateDialog from './Dialogs/CreateList';
import Checkbox from '@material-ui/core/Checkbox';
import CreateItem from './Dialogs/CreateItem';
import API from '../../Utils/API';
import ProfileCard from '../profile/profileCard';


const style = {
  paper: {
    padding: '50px',
    // marginTop: '10px',
    marginBottom: '10px',
    height: '500px',
    overflowY: 'auto'
  },
  button: {
    marginLeft: '100%'
  },
  text: {
    marginLeft: '100%'
  },
  strike: {
    textDecorationLine: 'line-through'
  },
  display: {
    display: 'block'
  }
};

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: (this.props.user) ? this.props.user : null,
      lists: [],
      items: [],
      currentList: null,
      itemChecked: {}
    }
    //console.log(this.props.user);
  }

  componentDidMount() {
    this.loadInitData();
  }

  loadInitData = () => {
    let userProf = {
      user: this.state.user.displayName,
      email: this.state.user.email,
      imgUrl: this.state.user.photoURL
    }
    // console.log(userProf);
    API.getUser(userProf)
      .then(res => {
        this.setState({ user: res.data });
        // console.log(this.state.user);
        API.getList(res.data._id)
          .then(res => {
            this.setState({ lists: res.data });
            // console.log(this.state.lists);
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }

  onListCreate = (form) => {
    console.log(form);
    let listData = {
      _userId: this.state.user._id,
      name: form.description
    }
    API.saveList(listData)
      .then(res => {
        // console.log(res);
        this.loadInitData();
      })
  }

  deleteList = (id) => {
    API.deleteList(id)
      .then(res => {
        // console.log(res);
        this.loadInitData();
        this.setState({ items: [] })
      })
  }

  deleteItem = (id) => {
    API.deleteItem(id)
      .then(res => {
        console.log(res);
        this.loadItemForList(this.state.currentList)
      })
  }

  loadItemForList = (id) => {
    API.getAllitemsForList(id)
      .then(res => {
        // console.log(res);
        this.setState({ items: res.data })
        // this.setState({ currentList: id })
      })
  }

  onItemCreate = (item) => {
    let itemDesc = item.description;
    //let list_ID = item.listId;
    let itemData = {
      _listId: item.listID,
      name: itemDesc,
      isleNum: ""
    };
    console.log(itemData._listId);
    API.createItem(itemData)
      .then(res => {
        // console.log(res.data._listId);
        this.loadItemForList(res.data._listId);
      })
  }

  selectList = (id) => {
    this.setState({ currentList: id })
    this.loadItemForList(id);
  }

  handleToggle = (id, e) => {
    let itemChecked = this.state.itemChecked;
    itemChecked[id] = e.target.checked;
    this.setState({
      itemChecked
    });
    console.log(this.state.itemChecked);
  }

  render() {
    return (
      <Grid container 
            spacing={16}
            // className={classes.demo}
            // alignItems={alignItems}
            // direction={direction}
            justify='center'
            spacing="40">
        <Grid item xs={8} justify='center'>
          <Paper style={style.paper}>
            <Typography variant="headline" align="right"> Add a Shopping List</Typography>
            <CreateDialog
              onCreate={this.onListCreate}
            />
            <List component="nav">
              {this.state.lists.length ? (
                <div>
                  {this.state.lists.map(list => (
                    <div>
                      <ListItem button onClick={() => this.selectList(list._id)}>
                        <ListItemText primary={list.name} />
                        <ListItemSecondaryAction>
                          <CreateItem
                            onCreate={this.onItemCreate}
                            listID={list._id}
                            listName={list.name}
                          />
                        </ListItemSecondaryAction>
                        <ListItemSecondaryAction>
                          <IconButton aria-label="Delete" style={style.button} onClick={() => this.deleteList(list._id)}>
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                      <Divider />
                    </div>
                  ))}
                </div>
              )
              :
              (
                <div>
                  <Paper>
                    You have not created any shopping Lists.
                    </Paper>
                </div>
                )}
            </List>
          </Paper>
        </Grid>
        {/* <Grid item xs={3} justify='center'>
          <Paper style={style.paper}>
            <Typography variant="headline" align="right"> Shopping Cart</Typography>
            <List component="nav">
              <div>
                {this.state.items.length ? (
                  <div>
                    {this.state.items.map(item => (
                      <div>
                        <ListItem button>
                          <Checkbox
                            onChange={(e) => this.handleToggle(item._id, e)}
                            //checked={this.state.checked.indexOf(value) !== -1}
                            key={item._id}
                          />
                          <ListItemText primary={item.name} style={(this.state.itemChecked[item._id]) ? style.strike : style.display} />
                          {this.state.itemChecked[item._id] === true ? (
                            <ListItemSecondaryAction>
                              <IconButton aria-label="Delete" style={style.button} onClick={() => this.deleteItem(item._id)}>
                                <DeleteIcon />
                              </IconButton>
                            </ListItemSecondaryAction>
                          ) : <div> </div>
                          }
                        </ListItem>
                        <Divider />
                      </div>
                    ))}
                  </div>
                ) : (<div><br /><Paper><Typography variant="body2" align="center">Your shopping cart is empty, please select a list</Typography></Paper></div>)
                }
              </div>
            </List>
          </Paper>
        </Grid> */}
        <Grid item xs={2} justify='flex-end'>
            <ProfileCard style={{position: "fixed"}}/>
        </Grid>
      </Grid>
    );
  }
}