import HomeIcon from '@mui/icons-material/Home';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import MailIcon from '@mui/icons-material/Mail';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PeopleIcon from '@mui/icons-material/People';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import PersonIcon from '@mui/icons-material/Person';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { useSelector } from 'react-redux';
// const usernameSelector = useSelector((state) => state.user.user);
const SidebarItems = [
    {
        name: "Home",
        route: '/home',
        filled:HomeIcon,
        outlined:HomeOutlinedIcon,
    },
    {
        name: "Messages",
        route: '/messages',
        filled:MailIcon,
        outlined:MailOutlineIcon,
    },
    {
        name: "Connections",
        route: '/connections',
        filled:PeopleIcon,
        outlined:PeopleOutlineOutlinedIcon,
    },
    {
        name: "Bookmarks",
        route: '/bookmarks',
        filled:BookmarkIcon,
        outlined:BookmarkBorderOutlinedIcon,
    },
    {
        name:"Profile",
        route: `/:profileName`,
        filled:PersonIcon,
        outlined:PersonOutlineOutlinedIcon,
    },
    {
        name:"Settings & Privacy",
        route: '/setting',
        filled:SettingsIcon,
        outlined:SettingsOutlinedIcon,
    }
]
export default SidebarItems;