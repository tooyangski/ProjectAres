import React, { useState, useContext } from "react";
import formatDate from "../../helpers/DateFormatter";

import ConfirmModal from "../../shared/components/modals/ConfirmModal";
import { AuthContext } from "../../shared/context/auth-context";

import AddCategory from "./AddCategory";

const CategoryTable = (props) => {
  const { onDataChanged, sendRequest } = props;
  const auth = useContext(AuthContext);

  const [categoryId, setCategoryId] = useState(null);
  const [showModal, setShowModal] = useState(null);

  const closeModalHandler = () => {
    setShowModal(null);
  };

  const confirmEnableHandler = async () => {
    setShowModal(null);
    try {
      const formData = new FormData();
      formData.append("isActive", true);
      await sendRequest(`/api/category/${categoryId}`, "PATCH", formData, {
        Authorization: "Bearer " + auth.token,
      });

      onDataChanged();
    } catch (err) {
      console.log(err);
    }
  };

  const confirmDisableHandler = async () => {
    setShowModal(null);
    try {
      await sendRequest(`/api/category/${categoryId}`, "DELETE", null, {
        Authorization: "Bearer " + auth.token,
      });

      onDataChanged();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <React.Fragment>
      {showModal === "DISABLE" && (
        <ConfirmModal
          onConfirm={confirmDisableHandler}
          onCancel={closeModalHandler}
        ></ConfirmModal>
      )}

      {showModal === "ENABLE" && (
        <ConfirmModal
          onConfirm={confirmEnableHandler}
          onCancel={closeModalHandler}
        ></ConfirmModal>
      )}

      {showModal === "ADD" && (
        <AddCategory
          closeModalHandler={closeModalHandler}
          sendRequest={sendRequest}
          onDataChanged={onDataChanged}
        />
      )}

      <div>
        <div className="field is-grouped">
          <div className="buttons has-addons">
            <p className="control">
              <button
                className="button is-link"
                onClick={() => {
                  setShowModal("ADD");
                }}
              >
                CREATE NEW CATEGORY
              </button>
            </p>
          </div>
        </div>

        <table className="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Image</th>
              <th>Image URL</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {props.categories.map((category) => (
              <tr key={category.id} id={category.id}>
                <td>{category.name}</td>
                <td>{category.description}</td>
                <td>
                  <figure className="container image is-64x64">
                    <img src={category.image} alt={category.name} />
                  </figure>
                </td>
                <td>
                  <a href={category.image}>View Image</a>
                </td>
                <td>{category.isActive ? "ENABLED" : "DISABLED"}</td>
                <td>{formatDate(category.createdAt)}</td>
                <td>{formatDate(category.updatedAt)}</td>
                <td>
                  <div className="field is-grouped">
                    <p className="control">
                      <button className="button is-primary">View</button>
                    </p>
                    <p className="control">
                      <button className="button is-warning">Edit</button>
                    </p>
                    <p className="control">
                      {category.isActive && (
                        <button
                          className="button is-danger"
                          onClick={() => {
                            setShowModal("DISABLE");
                            setCategoryId(category.id);
                          }}
                        >
                          Disable
                        </button>
                      )}

                      {!category.isActive && (
                        <button
                          className="button is-info"
                          onClick={() => {
                            setShowModal("ENABLE");
                            setCategoryId(category.id);
                          }}
                        >
                          Enable
                        </button>
                      )}
                    </p>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </React.Fragment>
  );
};

export default CategoryTable;
