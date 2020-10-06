import React, { useContext } from "react";
import registerLogo from "../images/register.svg";

import CubeSpinner from "../shared/components/loaders/CubeSpinner";
import ErrorNotification from "../shared/components/notifications/ErrorNotification";

import { useForm } from "react-hook-form";
import { useHttpClient } from "../shared/hooks/http-hook";
import { AuthContext } from "../shared/context/auth-context";

const Signup = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const { register, handleSubmit, errors } = useForm();

  const onSubmit = async (data) => {
    try {
      const responseData = await sendRequest(
        "/api/user/signup",
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
      <div className="container">
        {isLoading && <CubeSpinner />}

        <section className="hero is-fullheight">
          <div className="hero-body">
            <div className="container">
              <div className="column is-4 is-offset-4">
                <h3 className="title has-text-black has-text-centered">
                  SIGN-UP
                </h3>

                <hr className="login-hr" />
                <div className="box">
                  <figure className="avatar has-text-centered">
                    <img
                      src={registerLogo}
                      width="110px"
                      height="110px"
                      alt="profile"
                    />
                  </figure>

                  <hr className="login-hr" />
                  {error && (
                    <ErrorNotification onClose={clearError}>
                      {error}
                    </ErrorNotification>
                  )}

                  <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className="field">
                      <div className="control">
                        <input
                          name="name"
                          className="input"
                          type="text"
                          placeholder="Your full name"
                          ref={register({
                            required: true,
                            minLength: 5,
                            maxLength: 50,
                          })}
                        />

                        {errors.name && errors.name.type === "required" && (
                          <span className="tag is-danger">
                            This field is required.
                          </span>
                        )}

                        {errors.name && errors.name.type === "minLength" && (
                          <span className="tag is-danger">
                            This field needs at least 5 characters.
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="field">
                      <div className="control">
                        <input
                          name="email"
                          className="input"
                          placeholder="Your Email"
                          ref={register({
                            required: true,
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: "Invalid email address",
                            },
                          })}
                        />

                        {errors.email && errors.email.type === "required" && (
                          <span className="tag is-danger">
                            This field is required.
                          </span>
                        )}

                        {errors.email && errors.email.type === "pattern" && (
                          <span className="tag is-danger">
                            Invalid Email Address.
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
                            pattern: /\d/,
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

                        {errors.password &&
                          errors.password.type === "pattern" && (
                            <span className="tag is-danger">
                              Password must contain at least one digit.
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
                  <a href="../">Sign In</a> &nbsp;·&nbsp;
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

export default Signup;
