import React, {
  useState,
  useContext,
} from "react";
import styled from "styled-components";
import Column from "./column";
import { Requester } from "../components/requester";
import Button from "../components/button";
import Error from "../components/error";

export const Card = styled.section`
  margin: 1rem;
  margin-bottom: 0;
  background: ${({theme}) => theme.card.bg};
  border: 1px solid ${({theme}) => theme.card.border};
  padding: 1rem;
  border-radius: 0.5rem;
`;

export default ({ ...props }) => {
  const r = useContext(Requester);
  const [error, setError] = useState(null);

  const [userFlairs, storeUserFlairs] = useState([]);
  const getUserFlairs = () => {
    r.getSubreddit("firefox")
      .getUserFlairList({ name: "antabaka" })
      .then(
        (result) => {
          // console.log(result);
          storeUserFlairs(result);
        },
        (e) => setError({ e })
      );
  };
  const [templates, setTemplates] = useState([]);
  const getTemplates = () => {
    r.getSubreddit("firefox")
      .getUserFlairTemplates()
      .then(
        (result) => {
          // console.log(result);
          setTemplates(result);
        },
        (e) => setError({ e })
      );
  };

  // const [myFlair, setMyFlair] = useState({});
  const getMyFlair = () => {
    r.getSubreddit("firefox")
      .getMyFlair()
      .then((result) => console.log(result), (e) => console.log(e));
  };

  return (
    <Column>
      <Card>
        <h1>Templates</h1>
        <Button onClick={getTemplates}>Get templates</Button>
        <table>
          <tbody>
            <tr>
              <th>text</th>
              <th>class</th>
              <th>id</th>
              <th>editable</th>
              <th>position</th>
            </tr>
            {templates.map((template) => (
              <tr key={template.flair_template_id}>
                <td>{template.flair_text}</td>
                <td>{template.flair_css_class}</td>
                <td>{template.flair_template_id}</td>
                <td>{template.flair_text_editable ? "yes" : "no"}</td>
                <td>{template.flair_position}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <Card>
        <h1>Flairs</h1>
        <Button onClick={getUserFlairs}>Get flairs</Button>

        <table>
          <tbody>
            <tr>
              <th>text</th>
              <th>class</th>
              <th>id</th>
              <th>position</th>
            </tr>
            {userFlairs.map((flair) => (
              <tr key={flair.flair_template_id}>
                <td>{flair.flair_text}</td>
                <td>{flair.flair_css_class}</td>
                <td>{flair.flair_template_id}</td>
                <td>{flair.flair_position}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <Card>
        <h1>My flair</h1>
        <Button onClick={getMyFlair}>Get my flair</Button>
      </Card>
      {error ? <Error {...error} /> : null}
    </Column>
  );
};
