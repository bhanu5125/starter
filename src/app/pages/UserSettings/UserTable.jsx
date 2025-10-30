import { useEffect, useState } from "react";
import { Table, THead, TBody, Th, Tr, Td } from "components/ui";
import { Button } from "components/ui";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Page } from "components/shared/Page";
import { useErrorHandler } from "hooks";

const cols = ["S.No", "User Name", "Edit"];

export default function UserTable() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const { handleError } = useErrorHandler();

  useEffect(() => {
    axios.get("https://dev.trafficcounting.in/nodejs/api/get-users")
      .then((response) => {
        setUsers(response.data);
        console.log(response.data); // Log the response data directly
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        handleError(error, "Failed to load users.");
      });
  }, [handleError]);

  const handleEditClick = async (UserId, username) => {
    try {
      console.log("Sending UserId:", UserId); // Debug log
      const response = await axios.post("https://dev.trafficcounting.in/nodejs/api/generate-token", { UserId });
      console.log("Token received:", response.data.token); // Debug log
      const { token } = response.data;
      navigate(`/forms/user-form/${UserId}`, { state: { token, username } });
    } catch (error) {
      console.error("Error generating token:", error);
      handleError(error, "Failed to generate access token.");
    }
  };

  return (
    <Page title="Users Management">
    <div className="p-12 hide-scrollbar min-w-full overflow-x-auto">
      <Table zebra className="w-3/4 flex flex-row justify-self-center text-left rtl:text-right">
        <THead>
          <Tr>
            {cols.map((title, index) => (
              <Th
                key={index}
                className="bg-gray-200 font-semibold uppercase text-gray-800 ltr:first:rounded-l-lg ltr:last:rounded-r-lg rtl:first:rounded-r-lg rtl:last:rounded-l-lg dark:bg-dark-800 dark:text-dark-100"
              >
                {title}
              </Th>
            ))}
          </Tr>
        </THead>
        <TBody>
          {users.map((user, index) => (
            <Tr key={user.UserId}>
              <Td className="ltr:rounded-l-lg rtl:rounded-r-lg">{index + 1}</Td>
              <Td>{user.UserName}</Td>
              <Td className="ltr:rounded-r-lg rtl:rounded-l-lg">
                <Button onClick={() => handleEditClick(user.UserId, user.UserName)}>Edit</Button>
              </Td>
            </Tr>
          ))}
        </TBody>
      </Table>
      <div className="p-5 flex items-center justify-self-center space-x-3 rtl:space-x-reverse">
        <Button
          type="button"
          className="min-w-[7rem]"
          onClick={() => {
            navigate("/dashboards/administration");
          }}
        >
          Back
        </Button>
      </div>
    </div>
    </Page>
  );
}