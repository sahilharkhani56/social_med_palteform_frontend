import HomeIcon from '@mui/icons-material/Home';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import MailIcon from '@mui/icons-material/Mail';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PeopleIcon from '@mui/icons-material/People';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import PersonIcon from '@mui/icons-material/Person';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
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