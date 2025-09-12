import type { LogoProps } from "@types";
import logo from "@assets/img/icon.png";

export const Logo = (props: LogoProps) => {
  return (
    <>
      <img className={props.className ?? ''} width={props.width} src={logo} alt="logo" />
    </>
  )
}
