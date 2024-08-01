import React, { useState, useEffect } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import axios from "axios";
import { FaTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { CiEdit } from "react-icons/ci";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import img from "../no-records.png";

function ProjectManager() {
  const [project, setProject] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://66a8f40de40d3aa6ff5a14f5.mockapi.io/api/v1/list"
        );
        setProject(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const deleteProject = (id) => {
    axios
      .delete(`https://66a8f40de40d3aa6ff5a14f5.mockapi.io/api/v1/list/${id}`)
      .then(() => {
        setProject(project.filter((project) => project.id !== id));
        toast.success("Project deleted successfully");
      })
      .catch((error) => {
        console.error("Error deleting project:", error);
      });
  };

  const handleAddClick = () => {
    setIsAdding(true);
    setEditingProjectId(null);
  };

  const handleEditClick = (id) => {
    setIsAdding(true);
    setEditingProjectId(id);
  };

  const handleFormSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      if (editingProjectId) {
        await axios.put(
          `https://66a8f40de40d3aa6ff5a14f5.mockapi.io/api/v1/list/${editingProjectId}`,
          values
        );
        toast.success("Project updated successfully");
      } else {
        await axios.post(
          "https://66a8f40de40d3aa6ff5a14f5.mockapi.io/api/v1/list",
          values
        );
        toast.success("Project added successfully");
      }
      resetForm();
      setIsAdding(false);
      setEditingProjectId(null);
      const response = await axios.get(
        "https://66a8f40de40d3aa6ff5a14f5.mockapi.io/api/v1/list"
      );
      setProject(response.data);
    } catch (error) {
      console.error("Error posting/updating data:", error);
      toast.error("Failed to add/update project");
    }
    setSubmitting(false);
  };

  const AddPro = () => {
    const [projectDetails, setProjectDetails] = useState(null);

    useEffect(() => {
      if (editingProjectId) {
        axios
          .get(
            `https://66a8f40de40d3aa6ff5a14f5.mockapi.io/api/v1/list/${editingProjectId}`
          )
          .then((response) => {
            setProjectDetails(response.data);
          })
          .catch((error) => {
            console.error("Error fetching project data:", error);
          });
      }
    }, [editingProjectId]);

    const initialValues = {
      projectCode: projectDetails?.projectCode || "",
      projectName: projectDetails?.projectName || "",
      clientCode: projectDetails?.clientCode || "",
      contactPersonName: projectDetails?.contactPersonName || "",
      mobileNumber: projectDetails?.mobileNumber || "",
      email: projectDetails?.email || "",
      projectStatus: projectDetails?.projectStatus || "",
    };

    const validationSchema = Yup.object().shape({
      projectCode: Yup.string().required("Project Code is required"),
      projectName: Yup.string().required("Project Name is required"),
      clientCode: Yup.string().required("Client Code is required"),
      contactPersonName: Yup.string().required(
        "Contact Person Name is required"
      ),
      mobileNumber: Yup.string().required("Mobile Number is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      projectStatus: Yup.string().required("Project Status is required"),
    });

    return (
      <div className="container-fluid" style={{ backgroundColor: "#E4EAEE" }}>
        <h3 className="text-center mb-5">
          {editingProjectId ? "UPDATE PROJECT" : "ADD PROJECT"}
        </h3>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleFormSubmit}
          enableReinitialize={true}
        >
          {({ isSubmitting }) => (
            <Form id="form">
              <div className="row mb-3">
                <label
                  htmlFor="projectCode"
                  className="col-sm-2 col-form-label"
                >
                  Project Code:
                </label>
                <div className="col-sm-10">
                  <Field
                    type="text"
                    className="form-control"
                    id="projectCode"
                    name="projectCode"
                  />
                  <ErrorMessage
                    name="projectCode"
                    component="div"
                    className="error"
                  />
                </div>
              </div>
              <div className="row mb-3">
                <label
                  htmlFor="projectName"
                  className="col-sm-2 col-form-label"
                >
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
                <label
                  htmlFor="contactPersonName"
                  className="col-sm-2 col-form-label"
                >
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
                <label
                  htmlFor="mobileNumber"
                  className="col-sm-2 col-form-label"
                >
                  Mobile Number:
                </label>
                <div className="col-sm-10">
                  <Field
                    type="text"
                    className="form-control"
                    id="mobileNumber"
                    name="mobileNumber"
                  />
                  <ErrorMessage
                    name="mobileNumber"
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
                    type="text"
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
              <div className="row mb-3">
                <label
                  htmlFor="projectStatus"
                  className="col-sm-2 col-form-label"
                >
                  Project Status:
                </label>
                <div className="col-sm-10">
                  <Field
                    type="text"
                    className="form-control"
                    id="projectStatus"
                    name="projectStatus"
                  />
                  <ErrorMessage
                    name="projectStatus"
                    component="div"
                    className="error"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {editingProjectId ? "UPDATE" : "SUBMIT"}
              </button>{" "}
            </Form>
          )}
        </Formik>
        <button
          onClick={() => setIsAdding(false)}
          className="btn btn-secondary mt-3"
        >
          Back to Projects
        </button>
      </div>
    );
  };

  return (
    <div
      className="container-fluid pt-2 pb-2"
      style={{ backgroundColor: "#E4EAEE" }}
    >
      {isAdding ? (
        <AddPro />
      ) : (
        <>
          <div className="d-flex" style={{ justifyContent: "space-between" }}>
            <h3 className="text-center ">Project List</h3>
            <button
              onClick={handleAddClick}
              className="btn btn-primary mb-3"
              style={{
                backgroundColor: "#03a9f4",
                color: "#fefefe",
                padding: "1 .75rem",
              }}
            >
              Add Project
            </button>
          </div>
          {loading ? (
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
            <table className="table mb-5">
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>Project Code</th>
                  <th>Client Code</th>
                  <th>Contact Person Name</th>
                  <th>Mobile Number</th>
                  <th>Email ID</th>
                  <th>Project Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {project.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center">
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
                  project.map((project) => (
                    <tr key={project.id}>
                      <td>{project.projectName}</td>
                      <td>{project.projectCode}</td>
                      <td>{project.clientCode}</td>
                      <td>{project.contactPersonName}</td>
                      <td>{project.mobileNumber}</td>
                      <td>{project.email}</td>
                      <td>{project.projectStatus}</td>
                      <td className="pt-2 pb-2">
                        <div style={{ display: "flex" }}>
                          <p
                            className="mb-0"
                            onClick={() => deleteProject(project.id)}
                          >
                            <FaTrashAlt
                              style={{ color: "red", cursor: "pointer" }}
                            />
                          </p>
                          <p
                            className="mb-0"
                            onClick={() => handleEditClick(project.id)}
                          >
                            <CiEdit
                              size={20}
                              style={{ cursor: "pointer", marginLeft: "10px" }}
                            />
                          </p>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}

export default ProjectManager;
