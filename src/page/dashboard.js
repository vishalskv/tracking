import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import img from "../no-records.png"; // Adjust the path based on your project structure
import { IoMdArrowDroprightCircle } from "react-icons/io";
import { PiPauseBold } from "react-icons/pi";
import { FaRegCircleStop } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaTrashAlt } from "react-icons/fa";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [intervals, setIntervals] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(
        "https://66a8f40de40d3aa6ff5a14f5.mockapi.io/api/v1/timer"
      );
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createProject = async (values) => {
    try {
      const response = await axios.post(
        "https://66a8f40de40d3aa6ff5a14f5.mockapi.io/api/v1/timer",
        {
          name: values.projectName,
          clientName: values.clientName,
          time: 0,
          status: "stopped",
        }
      );
      setProjects([response.data, ...projects]); // Prepend the new project
      setShowModal(false);
      toast.success("Project added successfully");
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const updateProject = async (id, data) => {
    try {
      const response = await axios.put(
        `https://66a8f40de40d3aa6ff5a14f5.mockapi.io/api/v1/timer/${id}`,
        data
      );
      setProjects(
        projects.map((project) => (project.id === id ? response.data : project))
      );
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const deleteProject = async (id) => {
    try {
      await axios.delete(
        `https://66a8f40de40d3aa6ff5a14f5.mockapi.io/api/v1/timer/${id}`
      );
      setProjects(projects.filter((project) => project.id !== id));
      toast.success("Project deleted successfully");
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const startTimer = (id) => {
    const project = projects.find((project) => project.id === id);
    if (project.status !== "running") {
      const intervalId = setInterval(() => {
        setProjects((prevProjects) =>
          prevProjects.map((p) =>
            p.id === id ? { ...p, time: p.time + 1000 } : p
          )
        );
      }, 1000);
      setIntervals({ ...intervals, [id]: intervalId });
      updateProject(id, {
        ...project,
        status: "running",
        startTime: Date.now(),
      });
    }
  };

  const pauseTimer = (id) => {
    const project = projects.find((project) => project.id === id);
    if (project.status === "running") {
      clearInterval(intervals[id]);
      const elapsed = Date.now() - project.startTime;
      updateProject(id, {
        ...project,
        status: "paused",
        time: project.time + elapsed,
      });
      setIntervals({ ...intervals, [id]: null });
    }
  };

  const stopTimer = (id) => {
    const project = projects.find((project) => project.id === id);
    if (project.status !== "stopped") {
      clearInterval(intervals[id]);
      const elapsed =
        project.status === "running" ? Date.now() - project.startTime : 0;
      updateProject(id, {
        ...project,
        status: "stopped",
        time: project.time + elapsed,
      });
      setIntervals({ ...intervals, [id]: null });
    }
  };

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
      2,
      "0"
    );
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  // Define validation schema using Yup
  const validationSchema = Yup.object({
    projectName: Yup.string()
      .required("Project name is required")
      .min(3, "Project name must be at least 3 characters long"),
    clientName: Yup.string()
      .required("Client name is required")
      .min(3, "Client name must be at least 3 characters long"),
  });

  return (
    <div className="container-fluid" style={{ backgroundColor: "#E4EAEE" }}>
      <div className="d-flex" style={{ justifyContent: "space-between" }}>
        <h3>Tracking</h3>
        <div className="mb-3">
          <Button
            style={{
              backgroundColor: "#03a9f4",
              color: "#fefefe",
              padding: "1 .75rem",
            }}
            className="btn mt-2"
            onClick={() => setShowModal(true)}
          >
            New Project
          </Button>
        </div>
      </div>
      {isLoading ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only"></span>
          </div>
        </div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Lead</th>
              <th>Project</th>
              <th>Timer</th>
              <th>Start/Stop</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.length > 0 ? (
              projects.map((project) => (
                <tr key={project.id}>
                  <td className="text-capitalize">{project.clientName}</td>
                  <td>{project.name}</td>
                  <td>{formatTime(project.time)}</td>
                  <td className="pt-2 pb-2">
                    <IoMdArrowDroprightCircle
                    style={{cursor:"pointer"}}
                      onClick={() => startTimer(project.id)}
                    />
                    &nbsp; &nbsp; &nbsp;
                    <PiPauseBold  style={{cursor:"pointer"}} onClick={() => pauseTimer(project.id)} />
                  </td>

                  <td>
                    &nbsp;
                    {/* <button
                      className="btn btn-danger mr-2 mb-2"
                      onClick={() => stopTimer(project.id)}
                    >
                      <FaRegCircleStop />
                    </button>{" "} */}
                    &nbsp;
                    <FaTrashAlt
                      style={{ color: "red", cursor:"pointer" }}
                      onClick={() => deleteProject(project.id)}
                    />
                  </td>
                </tr>
              ))
            ) : (
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
            )}
          </tbody>
        </table>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create Project</Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={{ projectName: "", clientName: "" }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            createProject(values);
            setSubmitting(false);
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleSubmit,
            isSubmitting,
          }) => (
            <Form onSubmit={handleSubmit}>
              <Modal.Body>
                <Form.Group controlId="formProjectName">
                  <Form.Label>Project Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="projectName"
                    value={values.projectName}
                    onChange={handleChange}
                    placeholder="Enter project name"
                    isInvalid={!!errors.projectName && touched.projectName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.projectName}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formClientName">
                  <Form.Label>Client Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="clientName"
                    value={values.clientName}
                    onChange={handleChange}
                    placeholder="Enter client name"
                    isInvalid={!!errors.clientName && touched.clientName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.clientName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit" disabled={isSubmitting}>
                  Create
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};

export default Dashboard;
