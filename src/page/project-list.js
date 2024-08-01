import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { CiEdit } from "react-icons/ci";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import img from "../no-records.png";

function Client() {
  const [project, setProject] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingClient, setEditingClient] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      fetchData();
      setLoading(false);
    }, 500);
  }, []);

  const fetchData = () => {
    axios
      .get("https://663264b2c51e14d69564519c.mockapi.io/client/add")
      .then((response) => {
        setProject(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const deleteProject = (id) => {
    axios
      .delete(`https://663264b2c51e14d69564519c.mockapi.io/client/add/${id}`)
      .then(() => {
        setProject(project.filter((proj) => proj.id !== id));
        toast.success("Client deleted successfully");
      })
      .catch((error) => {
        console.error("Error deleting project:", error);
      });
  };

  const handleClientAddedOrUpdated = () => {
    fetchData();
    setEditingClient(null);
  };

  const handleEditClient = (id) => {
    const client = project.find((proj) => proj.id === id);
    setEditingClient(client);
  };

  return (
    <div className="container-fluid" style={{backgroundColor:"#E4EAEE"}}>
      <div className="d-flex" style={{ justifyContent: "space-between" }}>
        <h3 className="text-center">Client List</h3>
        {!editingClient && (
          <button
            className="btn btn-success"
            style={{backgroundColor:"#03a9f4", color:"#fefefe",     padding: "1 .75rem"}}
            onClick={() => setEditingClient({})}
          >
            Add
          </button>
        )}
      </div>
      {editingClient ? (
        <AddClientForm
          client={editingClient}
          onClientAddedOrUpdated={handleClientAddedOrUpdated}
        />
      ) : loading ? (
        <div
          className="container"
          style={{
            alignContent: "center",
            justifyContent: "center",
            display: "flex",
          }}
        >
          <div className="row">
            <div className="col-12">
              <div className="spinner-container">
                <div className="spinner-border text-primary" role="status">
                  <span className="sr-only"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <table className="table mt-5">
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Code</th>
              <th>Client Name</th>
              <th>Address</th>
              <th>Person Name</th>
              <th>Phone Number</th>
              <th>Fax Number</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {project.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center">
                  <img
                    src={img}
                    style={{
                      height: "200px",
                      width: "200px",
                      marginTop: "100px",
                    }}
                  />
                  <br />
                  No records found
                </td>
              </tr>
            ) : (
              project.map((proj) => (
                <tr key={proj.id}>
                  <td>{proj.projectName}</td>
                  <td>{proj.clientCode}</td>
                  <td>{proj.clientName}</td>
                  <td>{proj.address}</td>
                  <td>{proj.contactPersonName}</td>
                  <td>{proj.contactNumber}</td>
                  <td>{proj.faxNumber}</td>
                  <td>{proj.email}</td>
                  <td className="pt-2 pb-2">
                    <div style={{ display: "flex" }}>
                      <p
                        onClick={() => deleteProject(proj.id)}
                        style={{ cursor: "pointer" }}
                        className="mb-0"
                      >
                        <FaTrashAlt style={{ color: "red" }} />
                      </p>
                      <p
                        onClick={() => handleEditClient(proj.id)}
                        style={{ cursor: "pointer" }}
                        className="mb-0"
                      >
                        <CiEdit size={20} />
                      </p>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

const AddClientForm = ({ client, onClientAddedOrUpdated }) => {
  const initialValues = {
    clientCode: client?.clientCode || "",
    projectName: client?.projectName || "",
    clientName: client?.clientName || "",
    address: client?.address || "",
    contactPersonName: client?.contactPersonName || "",
    contactNumber: client?.contactNumber || "",
    faxNumber: client?.faxNumber || "",
    email: client?.email || "",
  };

  const validationSchema = Yup.object().shape({
    clientCode: Yup.string().required("Client Code is required"),
    projectName: Yup.string().required("Project Name is required"),
    clientName: Yup.string().required("Client Name is required"),
    address: Yup.string().required("Address is required"),
    contactPersonName: Yup.string().required("Contact Person Name is required"),
    contactNumber: Yup.string().required("Contact Number is required"),
    faxNumber: Yup.string().required("Fax Number is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      if (client?.id) {
        await axios.put(
          `https://663264b2c51e14d69564519c.mockapi.io/client/add/${client.id}`,
          values
        );
        toast.success("Client updated successfully");
      } else {
        await axios.post(
          "https://663264b2c51e14d69564519c.mockapi.io/client/add",
          values
        );
        toast.success("Client added successfully");
      }
      resetForm();
      onClientAddedOrUpdated();
    } catch (error) {
      console.error("Error posting/updating data:", error);
      toast.error("Failed to add/update Client");
    }
    setSubmitting(false);
  };

  return (
    <div className="container-fluid">
      <h3 className="text-center mb-5">{client?.id ? "UPDATE CLIENT" : "ADD CLIENT"}</h3>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {({ isSubmitting }) => (
          <Form id="form">
            <div className="row mb-3">
              <label htmlFor="clientCode" className="col-sm-2 col-form-label">
                Client Code:
              </label>
              <div className="col-sm-10">
                <Field
                  type="text"
                  className="form-control"
                  id="clientCode"
                  name="clientCode"
                />
                <ErrorMessage
                  name="clientCode"
                  component="div"
                  className="error"
                />
              </div>
            </div>
            <div className="row mb-3">
              <label htmlFor="projectName" className="col-sm-2 col-form-label">
                Project Name:
              </label>
              <div className="col-sm-10">
                <Field
                  type="text"
                  className="form-control"
                  id="projectName"
                  name="projectName"
                />
                <ErrorMessage
                  name="projectName"
                  component="div"
                  className="error"
                />
              </div>
            </div>
            <div className="row mb-3">
              <label htmlFor="clientName" className="col-sm-2 col-form-label">
                Client Name:
              </label>
              <div className="col-sm-10">
                <Field
                  type="text"
                  className="form-control"
                  id="clientName"
                  name="clientName"
                />
                <ErrorMessage
                  name="clientName"
                  component="div"
                  className="error"
                />
              </div>
            </div>
            <div className="row mb-3">
              <label htmlFor="address" className="col-sm-2 col-form-label">
                Address:
              </label>
              <div className="col-sm-10">
                <Field
                  type="text"
                  className="form-control"
                  id="address"
                  name="address"
                />
                <ErrorMessage
                  name="address"
                  component="div"
                  className="error"
                />
              </div>
            </div>
            <div className="row mb-3">
              <label htmlFor="contactPersonName" className="col-sm-2 col-form-label">
                Contact Person Name:
              </label>
              <div className="col-sm-10">
                <Field
                  type="text"
                  className="form-control"
                  id="contactPersonName"
                  name="contactPersonName"
                />
                <ErrorMessage
                  name="contactPersonName"
                  component="div"
                  className="error"
                />
              </div>
            </div>
            <div className="row mb-3">
              <label htmlFor="contactNumber" className="col-sm-2 col-form-label">
                Contact Number:
              </label>
              <div className="col-sm-10">
                <Field
                  type="text"
                  className="form-control"
                  id="contactNumber"
                  name="contactNumber"
                />
                <ErrorMessage
                  name="contactNumber"
                  component="div"
                  className="error"
                />
              </div>
            </div>
            <div className="row mb-3">
              <label htmlFor="faxNumber" className="col-sm-2 col-form-label">
                Fax Number:
              </label>
              <div className="col-sm-10">
                <Field
                  type="text"
                  className="form-control"
                  id="faxNumber"
                  name="faxNumber"
                />
                <ErrorMessage
                  name="faxNumber"
                  component="div"
                  className="error"
                />
              </div>
            </div>
            <div className="row mb-3">
              <label htmlFor="email" className="col-sm-2 col-form-label">
                Email:
              </label>
              <div className="col-sm-10">
                <Field
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="error"
                />
              </div>
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {client?.id ? "Update" : "Add"} Client
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Client;
