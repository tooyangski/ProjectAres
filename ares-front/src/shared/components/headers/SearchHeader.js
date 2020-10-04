import React from "react";

const SearchHeader = (props) => {
  return (
    <section className="hero is-info">
      <div className="hero-body">
        <div className="container">
          <div className="card">
            <div className="card-content">
              <div className="content">
                <div className="control has-icons-left has-icons-right">
                  <input className="input" type="search" />
                  <span className="icon is-medium is-left">
                    <i className="fa fa-search"></i>
                  </span>
                  <span className="icon is-medium is-right">
                    <i className="fa fa-empire"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchHeader;
