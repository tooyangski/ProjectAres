import React, { useContext } from "react";
import loginLogo from "../images/login.svg";

import ErrorModal from "../shared/components/modals/ErrorModal";
import CubeSpinner from "../shared/components/loaders/CubeSpinner";

import { useForm } from "react-hook-form";
import { useHttpClient } from "../shared/hooks/http-hook";
import { AuthContext } from "../shared/context/auth-context";

const Login = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const { register, handleSubmit, errors } = useForm();

  const onSubmit = async (data) => {
    try {
      const responseData = await sendRequest(
        "/api/user/login",
        "POST",
        JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
        {
          "Content-Type": "application/json",
        }
      );

      auth.login(responseData.userId, responseData.token);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <React.Fragment>
      <ErrorModal
        error={error}
        show={error ? true : false}
        isActive={error ? "is-active" : null}
        onClose={clearError}
      ></ErrorModal>
      <div className="container">
        {isLoading && <CubeSpinner />}
        <section className="hero is-fullheight">
          <div className="hero-body">
            <div className="container">
              <div className="column is-4 is-offset-4">
                <h3 className="title has-text-black has-text-centered">
                  LOG-IN
                </h3>
                <hr className="login-hr" />
                <div className="box">
                  <figure
                    className="avatar has-text-centered"
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <img
                      src={loginLogo}
                      width="110px"
                      height="110px"
                      alt="profile"
                    />
                  </figure>
                  <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className="field">
                      <div className="control">
                        <input
                          name="email"
                          className="input"
                          type="email"
                          placeholder="Your Email"
                          ref={register({ required: true })}
                        />

                        {errors.email && errors.email.type === "required" && (
                          <span className="tag is-danger">
                            This field is required.
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="field">
                      <div className="control">
                        <input
                          name="password"
                          className="input"
                          type="password"
                          placeholder="Your Password"
                          ref={register({
                            required: true,
                            minLength: 6,
                            maxLength: 50,
                          })}
                        />

                        {errors.password &&
                          errors.password.type === "required" && (
                            <span className="tag is-danger">
                              This field is required.
                            </span>
                          )}

                        {errors.password &&
                          errors.password.type === "minLength" && (
                            <span className="tag is-danger">
                              This field needs at least 6 characters.
                            </span>
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
                </div>
                <p className="has-text-grey has-text-centered">
                  <a href="../">Sign Up</a> &nbsp;·&nbsp;
                  <a href="../">Forgot Password</a> &nbsp;·&nbsp;
                  <a href="../">Need Help?</a>
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </React.Fragment>
  );
};

export default Login;
