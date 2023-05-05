import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PhoneIcon from '@material-ui/icons/Phone';
import FavoriteIcon from '@material-ui/icons/Favorite';
import HomeIcon from '@material-ui/icons/Home'
import PersonPinIcon from '@material-ui/icons/PersonPin';
import HelpIcon from '@material-ui/icons/Help';
import ShoppingBasket from '@material-ui/icons/ShoppingBasket';
import ThumbDown from '@material-ui/icons/ThumbDown';
import ThumbUp from '@material-ui/icons/ThumbUp';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import FaceIcon from '@material-ui/icons/Face';
import Timeline from './Timeline';
import Friends from './Friends';
import UploadNew from './UploadNew';
import Logout from './Logout';
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-prevent-tabpanel-${index}`}
      aria-labelledby={`scrollable-prevent-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `scrollable-prevent-tab-${index}`,
    'aria-controls': `scrollable-prevent-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function ScrollableTabsButtonPrevent() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <div className="photos mr-auto ml-auto col-xs-12 col-sm-12 col-md-8 col-lg-8">
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="off"
          aria-label="scrollable prevent tabs example"
        >
          <Tab icon={<HomeIcon />} aria-label="favorite" {...a11yProps(1)} />
          <Tab icon={<FaceIcon />} aria-label="phone" {...a11yProps(0)} />
          <Tab icon={<AddCircleOutlineIcon />} aria-label="help" {...a11yProps(2)} />
          <Tab icon={<PowerSettingsNewIcon />} aria-label="shopping" {...a11yProps(3)} />
 
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <Timeline />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Friends />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <UploadNew />
      </TabPanel>
      <TabPanel value={value} index={3}>
          <Logout />
      </TabPanel>
      </div>
    </div>
  );
}