import React from "react";
import styled from "styled-components";
import { ReactComponent as AlertCircle } from "../icons/alert-circle.svg";
import { ReactComponent as AlertTriangle } from "../icons/alert-triangle.svg";
import { ReactComponent as Archive } from "../icons/archive.svg";
import { ReactComponent as ArrowUpCircle } from "../icons/arrow-up-circle.svg";
import { ReactComponent as ArrowDownCircle } from "../icons/arrow-down-circle.svg";
import { ReactComponent as ArrowUp } from "../icons/arrow-up.svg";
import { ReactComponent as ArrowDown } from "../icons/arrow-down.svg";
import { ReactComponent as Check } from "../icons/check.svg";
import { ReactComponent as CheckCircle } from "../icons/check-circle.svg";
import { ReactComponent as ChevronDown } from "../icons/chevron-down.svg";
import { ReactComponent as ChevronLeft } from "../icons/chevron-left.svg";
import { ReactComponent as ChevronRight } from "../icons/chevron-right.svg";
import { ReactComponent as ChevronUp } from "../icons/chevron-up.svg";
import { ReactComponent as Coffee } from "../icons/coffee.svg";
import { ReactComponent as Collapse } from "../icons/minus-square.svg";
import { ReactComponent as ColumnView } from "../icons/columns.svg"; // view mode
import { ReactComponent as Compact } from "../icons/server.svg"; // view mode
import { ReactComponent as Expand } from "../icons/plus-square.svg";
import { ReactComponent as External } from "../icons/external-link.svg";
import { ReactComponent as EyeOff } from "../icons/eye-off.svg";
import { ReactComponent as Eye } from "../icons/eye.svg";
import { ReactComponent as Filter } from "../icons/filter.svg";
import { ReactComponent as HelpCircle } from "../icons/help-circle.svg";
import { ReactComponent as Hexagon } from "../icons/hexagon.svg";
import { ReactComponent as InfoCircle } from "../icons/info.svg";
import { ReactComponent as Lock } from "../icons/lock.svg";
import { ReactComponent as Login } from "../icons/log-in.svg";
import { ReactComponent as Logout } from "../icons/log-out.svg";
import { ReactComponent as Message } from "../icons/message-square.svg";
import { ReactComponent as Mail } from "../icons/mail.svg";
import { ReactComponent as MinusCircle } from "../icons/minus-circle.svg";
import { ReactComponent as More } from "../icons/more-horizontal.svg";
import { ReactComponent as MoreVertical } from "../icons/more-vertical.svg";
import { ReactComponent as Pin } from "../icons/pin.svg";
import { ReactComponent as PlayCircle } from "../icons/play-circle.svg";
import { ReactComponent as PlusCircle } from "../icons/plus-circle.svg";
import { ReactComponent as Refresh } from "../icons/refresh-cw.svg";
import { ReactComponent as Reply } from "../icons/corner-down-right.svg";
import { ReactComponent as Share } from "../icons/share.svg";
import { ReactComponent as Shield } from "../icons/shield.svg";
import { ReactComponent as Square } from "../icons/square.svg"; // view mode
import { ReactComponent as Star } from "../icons/star.svg";
import { ReactComponent as ToggleOff } from "../icons/toggle-left.svg";
import { ReactComponent as ToggleOn } from "../icons/toggle-right.svg";
import { ReactComponent as Trash } from "../icons/trash.svg";
import { ReactComponent as Unlock } from "../icons/unlock.svg";
import { ReactComponent as User } from "../icons/user.svg";
import { ReactComponent as X } from "../icons/x.svg";
import { ReactComponent as XCircle } from "../icons/x-circle.svg";
import { ReactComponent as XPost } from "../icons/shuffle.svg";
import { ReactComponent as Maximize } from "../icons/maximize.svg";
import { ReactComponent as Moon } from "../icons/moon.svg";
import { ReactComponent as Sun } from "../icons/sun.svg";
import { ReactComponent as Menu } from "../icons/menu.svg";
import { ReactComponent as Flag } from "../icons/flag.svg";
import { ReactComponent as Heart } from "../icons/heart.svg";
import { ReactComponent as Debug } from "../icons/terminal.svg";
import { ReactComponent as Search } from "../icons/search.svg";
import { ReactComponent as Cog } from "../icons/settings.svg";

import { ReactComponent as Logo } from "../icons/logo.svg";
import { ReactComponent as Popular } from "../icons/trending-up.svg";
import { ReactComponent as All } from "../icons/bar-chart-2.svg";
import { ReactComponent as Home } from "../icons/home.svg";

const IconMap = {
  alert: <AlertCircle />,
  alerttriangle: <AlertTriangle />,
  archive: <Archive />,
  arrowdowncircle: <ArrowDownCircle />,
  arrowupcircle: <ArrowUpCircle />,
  arrowdown: <ArrowDown />,
  arrowup: <ArrowUp />,
  check: <Check />,
  checkcircle: <CheckCircle />,
  chevrondown: <ChevronDown />,
  chevronleft: <ChevronLeft />,
  chevronright: <ChevronRight />,
  chevronup: <ChevronUp />,
  coffee: <Coffee />,
  cog: <Cog />,
  collapse: <Collapse />,
  column: <ColumnView />,
  compact: <Compact />,
  expand: <Expand />,
  external: <External />,
  eyeoff: <EyeOff />,
  eye: <Eye />,
  filter: <Filter />,
  help: <HelpCircle />,
  hexagon: <Hexagon />,
  info: <InfoCircle />,
  lock: <Lock />,
  login: <Login />,
  logout: <Logout />,
  message: <Message />,
  mail: <Mail />,
  minus: <MinusCircle />,
  more: <More />,
  morevertical: <MoreVertical />,
  pin: <Pin />,
  play: <PlayCircle />,
  plus: <PlusCircle />,
  refresh: <Refresh />,
  reply: <Reply />,
  share: <Share />,
  shield: <Shield />,
  square: <Square />,
  star: <Star />,
  toggleoff: <ToggleOff />,
  toggleon: <ToggleOn />,
  trash: <Trash />,
  unlock: <Unlock />,
  user: <User />,
  x: <X />,
  xcircle: <XCircle />,
  xpost: <XPost />,
  maximize: <Maximize />,
  moon: <Moon />,
  sun: <Sun />,
  menu: <Menu />,
  logo: <Logo />,
  home: <Home />,
  popular: <Popular />,
  all: <All />,
  flag: <Flag />,
  heart: <Heart />,
  debug: <Debug />,
  search: <Search />,
  none: null,
};

const IconWrapper = styled.span`
  /* Aligns icons to font */
  position: relative;
  bottom: ${props => (props.doNotAlignBaseline ? "0" : "-0.135em")};
  margin-top: ${props => (props.doNotAlignBaseline ? "0" : "-0.135em")};
  display: inline-block;
  width: 1em;
  height: 1em;
  color: inherit;
  margin-right: ${props => (props.marginRight ? "0.25em" : "0")};
  svg {
    transform: ${props =>
      props.rotate ? "rotate(" + props.rotate + ")" : null};
    color: inherit;
    height: inherit;
    width: inherit;
    stroke-width: ${props => (props.thin ? 1 : 2)};
  }
`;

export default class Icon extends React.Component {
  static propTypes = {
    icon: (props, propName, componentName) => {
      if (!IconMap[props[propName].toLowerCase()]) {
        return new Error(
          "Invalid icon name `" +
            props[propName] +
            "` supplied to `" +
            componentName +
            "`. Must be one of: " +
            Object.keys(IconMap)
        );
      }
    },
  };
  render() {
    const { icon = "info", label, "data-tip": data_tip, ...props } = this.props;
    if (IconMap[icon.toLowerCase()])
      return (
        <IconWrapper {...props} data-tip={data_tip || label}>
          {IconMap[icon.toLowerCase()]}
        </IconWrapper>
      );
    else return null;
  }
}
