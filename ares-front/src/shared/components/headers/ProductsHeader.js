import React from "react";
import { Link } from "react-router-dom";

import cpuLogo from "../../../images/cpu.svg";
import gpuLogo from "../../../images/graphics-card.svg";
import ramLogo from "../../../images/ram.svg";
import keyboardLogo from "../../../images/keyboard.svg";
import motherboardLogo from "../../../images/motherboard.svg";
import headphoneLogo from "../../../images/headphone.svg";

const ProductsHeader = () => {
  return (
    <div className="container mt-4">
      <nav className="level is-desktop">
        <div className="level-item has-text-centered">
          <div>
            <Link to="/">
              <p className="heading">CPU</p>
              <img src={cpuLogo} width="50px" height="50px" alt="CPU"></img>
            </Link>
          </div>
        </div>

        <div className="level-item has-text-centered">
          <div>
            <Link to="/">
              <p className="heading">GPU</p>
              <img src={gpuLogo} width="50px" height="50px" alt="GPU"></img>
            </Link>
          </div>
        </div>

        <div className="level-item has-text-centered">
          <div>
            <Link to="/">
              <p className="heading">RAM</p>
              <img src={ramLogo} width="50px" height="50px" alt="RAM"></img>
            </Link>
          </div>
        </div>

        <div className="level-item has-text-centered">
          <div>
            <Link to="/">
              <p className="heading">Keyboard</p>
              <img
                src={keyboardLogo}
                width="50px"
                height="50px"
                alt="Keyboard"
              ></img>
            </Link>
          </div>
        </div>

        <div className="level-item has-text-centered">
          <div>
            <Link to="/">
              <p className="heading">Motherboard</p>

              <img
                src={motherboardLogo}
                width="50px"
                height="50px"
                alt="Motherboard"
              ></img>
            </Link>
          </div>
        </div>

        <div className="level-item has-text-centered">
          <div>
            <Link to="/">
              <p className="heading">Headphones</p>
              <img
                src={headphoneLogo}
                width="50px"
                height="50px"
                alt="Headphone"
              ></img>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};
export default ProductsHeader;
