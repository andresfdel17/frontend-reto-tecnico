import type { IFullLoaderParams } from "@types";
import transparent_logo from '@assets/img/transparent_logo.png';
import './FullLoader.css';
import { useEffect } from "react";

export const FullLoader = ({
    altText = 'Cargando...',
    backgroundColor = '#ffffff',
    imageSize = 100,
    fullSize = false,
}: IFullLoaderParams) => {
    useEffect(() => {
        if(!fullSize) document.getElementsByTagName("html")[0].setAttribute("data-status", 'loading');
        return () => {
            document.getElementsByTagName("html")[0].removeAttribute("data-status");
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div
            className={fullSize ? "fullscreen-loader" : "loader"}
            style={{ backgroundColor }}
        >
            <img
                src={transparent_logo}
                alt={altText}
                className="ripple-image"
                style={{ width: imageSize, height: imageSize }}
            />
        </div>
    );
}
