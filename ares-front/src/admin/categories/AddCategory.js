import React, { useState, useContext } from "react";

import AddModal from "../../shared/components/modals/AddModal";

import { useForm } from "react-hook-form";
import { AuthContext } from "../../shared/context/auth-context";

const AddCategory = (props) => {
  const auth = useContext(AuthContext);

  const { register, handleSubmit, errors } = useForm();
  const [previewUrl, setPreviewUrl] = useState(null);
  const { closeModalHandler, sendRequest, onDataChanged } = props;

  const onSubmitCategory = async (data) => {
    setPreviewUrl(null);
    closeModalHandler();

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("image", data.image[0]);

      await sendRequest(`/api/category/`, "POST", formData, {
        Authorization: "Bearer " + auth.token,
      });

      onDataChanged();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AddModal onCancel={closeModalHandler} headerTitle="Add new category:">
      <form className="" onSubmit={handleSubmit(onSubmitCategory)}>
        <div className="field">
          <div className="control">
            <input
              name="name"
              className="input"
              type="text"
              placeholder="Category"
              ref={register({
                required: true,
                minLength: 3,
                maxLength: 50,
              })}
            />

            {errors.name && errors.name.type === "required" && (
              <span className="tag is-danger">This field is required.</span>
            )}

            {errors.name && errors.name.type === "minLength" && (
              <span className="tag is-danger">
                This field needs at least 3 characters.
              </span>
            )}
          </div>
        </div>

        <div className="field">
          <div className="control">
            <textarea
              name="description"
              className="textarea"
              placeholder="Description"
              ref={register({
                required: true,
                minLength: 5,
                maxLength: 50,
              })}
            ></textarea>

            {errors.description && errors.description.type === "required" && (
              <span className="tag is-danger">This field is required.</span>
            )}

            {errors.description && errors.description.type === "minLength" && (
              <span className="tag is-danger">
                This field needs at least 5 characters.
              </span>
            )}
          </div>
        </div>

        <div className="field">
          <div className="control">
            <div className="file is-boxed">
              <label className="file-label">
                <input
                  className="file-input"
                  type="file"
                  name="image"
                  accept=".svg,.jpg,.png,.jpeg,.webp"
                  ref={register({
                    required: true,
                  })}
                  onChange={(e) => {
                    setPreviewUrl(e.target.files[0].name);
                  }}
                />
                <span className="file-cta">
                  <span className="file-icon">
                    <i className="fas fa-upload"></i>
                  </span>
                  <span className="file-label">Choose a file…</span>
                </span>
                {previewUrl && <span className="file-name">{previewUrl}</span>}
              </label>
            </div>

            {errors.image && errors.image.type === "required" && (
              <span className="tag is-danger">This field is required.</span>
            )}
          </div>
        </div>

        <div className="field">
          <div className="control">
            <input
              className="button is-block is-info is-fullwidth"
              type="submit"
            />
          </div>
        </div>
      </form>
    </AddModal>
  );
};

export default AddCategory;
