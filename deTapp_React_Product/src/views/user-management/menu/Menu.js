import { Box, Button, Paper, styled, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDialog } from "../../utilities/alerts/DialogContent";
import RoleFormComponent from "./components/MenuFormComponent";
import DataTable from "../users/components/DataTable";
import {
  getMenusController,
  menuCreationController,
  menuDeleteController,
  menuUpdateController,
} from "./controllers/MenuControllers";

// Styled Components
const Container = styled(Paper)(({ theme }) => ({
  paddingBottom: theme.spacing(3),
  marginBottom: theme.spacing(5),
  borderRadius: theme.spacing(1),
  boxShadow: theme.shadows[3],
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

const SecondContainer = styled(Paper)(({ theme }) => ({
  paddingBottom: theme.spacing(3),
  marginBottom: theme.spacing(5),
  borderRadius: theme.spacing(1),
  boxShadow: theme.shadows[3],
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

const Header = styled(Box)(({ theme }) => ({
  backgroundColor: "#1e88e5",
  color: "#fff",
  padding: theme.spacing(2),
  borderTopLeftRadius: theme.spacing(1),
  borderTopRightRadius: theme.spacing(1),
  marginBottom: theme.spacing(2),
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

const SubHeader = styled(Box)(({ theme }) => ({
  color: "#1e88e5",
  padding: theme.spacing(2),
  borderTopLeftRadius: theme.spacing(1),
  borderTopRightRadius: theme.spacing(1),
  marginBottom: theme.spacing(2),
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

const FormButton = styled(Button)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
}));

/**
 * Menus component displays a user management interface with a form and a data table.
 *
 * @component
 * @example
 * return (
 *   <Menus />
 * )
 */
const Menus = () => {
  const [selectedValue, setSelectedValue] = useState({});
  const [tableData, setTableData] = useState([]);
  const [formAction, setFormAction] = useState({
    display: false,
    action: "update",
  });

  const { openDialog } = useDialog();

  const getRoles = async () => {
    const response = await getMenusController();
    setTableData(response);
  };

  // Fetches roles data and updates the roles list
  useEffect(() => {
    getRoles();
  }, []);

  const columns = {
    NAME: "Menu",
    DESCRIPTION: "Description",
  };

  /**
   * Initiates the process to add a new user.
   */
  const addRoles = () => {
    setFormAction({
      display: true,
      action: "add",
    });
  };

  /**
   * Handles form submission for adding or updating a user.
   * @param {Object} formData - The data from the form.
   */
  const onformSubmit = async (formData) => {
    try {
      let response = null;
      const isAdd = formAction.action === "add";
      if (isAdd) response = await menuCreationController(formData);
      else {
        formData = { ...formData, ID: selectedValue.ID };
        response = await menuUpdateController(formData);
      }

      if (response) {
        openDialog(
          "success",
          `Menu ${isAdd ? "Addition" : "Updation"} Success`,
          response.message,
          {
            confirm: {
              name: "Ok",
              isNeed: true,
            },
            cancel: {
              name: "Cancel",
              isNeed: false,
            },
          },
          (confirmed) => {
            getRoles();
            if (!isAdd) {
              onFormReset();
            }
          }
        );
      }
    } catch (error) {
      const isAdd = formAction.action === "add";
      openDialog(
        "warning",
        "Warning",
        `Menu ${isAdd ? "Addition" : "Updation"} failed`,
        {
          confirm: {
            name: "Ok",
            isNeed: true,
          },
          cancel: {
            name: "Cancel",
            isNeed: false,
          },
        },
        (confirmed) => {
          if (confirmed) {
            return;
          }
        }
      );
    }
  };

  /**
   * Resets the form and hides it.
   */
  const onFormReset = () => {
    setFormAction({
      display: false,
      action: null,
    });
  };

  /**
   * Initiates the process to update a user's information.
   * @param {Object} selectedRow - The selected user's data.
   */
  const handleUpdateLogic = (selectedRow) => {
    setSelectedValue(selectedRow);
    setFormAction({
      display: true,
      action: "update",
    });
  };

  /**
   * Initiates the process to delete a user.
   * @param {Object} selectedRow - The selected user's data.
   */
  const handleDelete = (selectedRow) => {
    openDialog(
      "warning",
      `Delete confirmation`,
      `Are you sure you want to delete this menu "${selectedRow.NAME}"?`,
      {
        confirm: {
          name: "Yes",
          isNeed: true,
        },
        cancel: {
          name: "No",
          isNeed: true,
        },
      },
      (confirmed) => {
        if (confirmed) {
          removeDataFromTable(selectedRow);
        }
      }
    );
  };

  /**
   * Removes a user from the table after confirming deletion.
   * @param {Object} selectedRow - The selected user's data.
   */
  const removeDataFromTable = async (selectedRow) => {
    try {
      const response = await menuDeleteController(selectedRow.ID);

      if (response) {
        openDialog(
          "success",
          `Menu Deletion Success`,
          response.message,
          {
            confirm: {
              name: "Ok",
              isNeed: true,
            },
            cancel: {
              name: "Cancel",
              isNeed: false,
            },
          },
          (confirmed) => {
            getRoles();
          }
        );
      }
    } catch (error) {
      openDialog(
        "warning",
        "Warning",
        `Menu Deletion failed`,
        {
          confirm: {
            name: "Ok",
            isNeed: true,
          },
          cancel: {
            name: "Cancel",
            isNeed: false,
          },
        },
        (confirmed) => {
          if (confirmed) {
            return;
          }
        }
      );
    }
  };

  return (
    <>
      {formAction.display && (
        <Container>
          <Header>
            <Typography variant="h6">
              {formAction.action === "add"
                ? "Add"
                : formAction.action === "update"
                ? "Update"
                : "Read "}{" "}
              Menu
            </Typography>
          </Header>
          <RoleFormComponent
            formAction={formAction}
            defaultValues={selectedValue}
            onSubmit={onformSubmit}
            onReset={onFormReset}
          />
        </Container>
      )}

      <SecondContainer>
        <SubHeader>
          <Typography variant="h6">
            <b>Menus List</b>
          </Typography>
          <Box display="flex" justifyContent="space-between" flexWrap="wrap">
            <FormButton
              type="button"
              onClick={addRoles}
              variant="contained"
              color="primary"
              style={{ marginRight: "10px" }}
              disabled={formAction.action === "add" && formAction.display}
            >
              Add Menu
            </FormButton>
          </Box>
        </SubHeader>
        <DataTable
          tableData={tableData}
          handleUpdateLogic={handleUpdateLogic}
          handleDelete={handleDelete}
          columns={columns}
        />
      </SecondContainer>
    </>
  );
};

export default Menus;