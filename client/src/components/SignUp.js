import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Card from "./atoms/Card";
import FormGroup from "./atoms/FormGroup";
import Label from "./atoms/Label";
import TextInput from "./atoms/TextInput";
import PrimaryButton from "./atoms/PrimaryButton";

const SignUp = ({ signupSuccessRedirect }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // add a context for user session

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post(
      "http://localhost:8000/api/users/new",
      {
        username: username,
        password: password,
      },
      { withCredentials: true }
    );
    console.log(res);
    if (res.status === 400) {
      alert(res.data.msg);
    } else {
      alert(res.data);
      navigate(signupSuccessRedirect);
    }
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Card>
        <form onSubmit={(e) => handleSubmit(e)}>
          <h3>Sign-Up</h3>
          <FormGroup>
            <Label>Username</Label>
            <TextInput
              type="text"
              id="userInput"
              name="username"
              value={username}
              required
              onChange={(e) => setUsername(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label>Password</Label>
            <TextInput
              type="password"
              id="passInput"
              name="password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label>Confirm Password</Label>
            <TextInput
              type="password"
              id="passInput"
              name="password"
              pattern={password}
              title="Please make sure it's the same with the password above."
              required
            />
          </FormGroup>
          <PrimaryButton type="submit">Sign-Up</PrimaryButton>
        </form>
      </Card>
    </div>
  );
};

export default SignUp;
