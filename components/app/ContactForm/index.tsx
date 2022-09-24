import React, { FormEvent, useRef, useState } from "react";
import contactApiConfig from "../../../pages/api/contact/config";
import { Submission, submitContactForm } from "../../../pages/api/contact";
import Button from "../../ui/Button";
import Form from "../../ui/Form";
import FormQuestion from "../../ui/Form/FormQuestion";
import Paper from "../../ui/Paper";
import Alert from "../../ui/Alert";

const ContactForm = () => {
  const contactNameRef = useRef<any>(null);
  const contactEmailRef = useRef<any>(null);
  const contactMessageRef = useRef<any>(null);
  const [contactFormSubmitted, setContactFormSubmitted] = useState<boolean>(false);
  const [contactFormFailed, setContactFormFailed] = useState<boolean>(false);
  const [isReadyForSubmission, setIsReadyForSubmission] = useState<boolean>(false);

  const updateIsReadyForSubmission = () => {
    setIsReadyForSubmission(
      contactNameRef.current.value.length > 0 &&
      contactEmailRef.current.value.length > 0 &&
      contactMessageRef.current.value.length > 0
    );
  };

  const handleSubmitContactForm = async (ev?: FormEvent) => {
    ev?.preventDefault();
    const submission = {
      contactName: contactNameRef.current.value,
      email: contactEmailRef.current.value,
      message: contactMessageRef.current.value
    } as Submission;
    try {
      await submitContactForm(submission);
      setContactFormSubmitted(true);
      setContactFormFailed(false);
    } catch (err) {
      console.error(err);
      setContactFormFailed(true);
    }
  };

  const handleResetContactForm = (ev?: FormEvent) => {
    ev?.preventDefault();
    contactNameRef.current.value = "";
    contactEmailRef.current.value = "";
    contactMessageRef.current.value = "";
    updateIsReadyForSubmission();
  };

  const testPopulateForm = (ev?: FormEvent) => {
    ev?.preventDefault();
    contactNameRef.current.value = "John Doe";
    contactEmailRef.current.value = "john.doe@world.com";
    contactMessageRef.current.value = "test message";
    updateIsReadyForSubmission();
  };

  return (
    <Paper className="contactForm" style={{ width: "100%" }}>
      <h3>Contact</h3>
      {
        contactApiConfig.debugMode
          ? (
            <Alert variant="warning" style={{ marginBottom: "1rem" }}>
              API is in debug mode
            </Alert>
          )
          : <></>
      }
      {
        contactFormFailed
          ? (
            <Alert variant="error" style={{ marginBottom: "1rem" }}>
              Failed to submit form!
            </Alert>
          )
          : <></>
      }
      {
        contactFormSubmitted
          ? (
            <>
              <Alert variant="success" style={{ marginBottom: "1rem" }}>
                Submitted successfully!
              </Alert>
            </>
          )
          : (
            <Form onSubmit={handleSubmitContactForm} onReset={handleResetContactForm}>
              <FormQuestion
                name="contactName"
                label="Name"
                variant="text"
                forwardedRef={contactNameRef}
                onChange={updateIsReadyForSubmission}
                required
              />
              <FormQuestion
                name="contactEmail"
                label="Email"
                variant="email"
                forwardedRef={contactEmailRef}
                onChange={updateIsReadyForSubmission}
                required
              />
              <FormQuestion
                name="contactMessage"
                label="Message"
                variant="multiline"
                style={{ resize: "vertical" }}
                forwardedRef={contactMessageRef}
                onChange={updateIsReadyForSubmission}
                required
              />
              <span className="formControls">
                {
                  contactApiConfig.debugMode
                    ? (
                      <>
                        <small>
                          <Button variant="primary" onClick={testPopulateForm}>
                            Populate
                          </Button>
                        </small>
                        <small>
                          <Button variant="reset">
                            Reset
                          </Button>
                        </small>
                      </>
                    )
                    : <></>
                }
                <small>
                  <Button variant="submit" disabled={!isReadyForSubmission}>
                    Submit
                  </Button>
                </small>
              </span>
            </Form>
          )
      }
    </Paper>
  );
};

export default ContactForm;
