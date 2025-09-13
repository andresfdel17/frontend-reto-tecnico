import type { LogoProps } from "@types";
import logo from "@assets/img/icon.png";
import logoTransparent from "@assets/img/transparent_logo.png";
import { memo } from "react";

const LogoComponent = (props: LogoProps) => {
  return (
    <>
      <img className={props.className ?? ''} width={props.width} src={!props?.transparent ? logo : logoTransparent} alt="logo" />
    </>
  )
}

export const Logo = memo(LogoComponent);
