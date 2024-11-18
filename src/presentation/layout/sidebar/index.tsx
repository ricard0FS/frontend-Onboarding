import { Data } from "./Data";
import { Link } from "react-router-dom";
import "./styles.css";

function Sidebar() {
  return (
    <div className="side-menu">
      <ul className="side-menu-items">
        {Data.map((item, index) => (
          <li key={index} className={item.cName}>
            <Link to={item.path} className="sidebar-link">
              {item.icon}
              <span>{item.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
