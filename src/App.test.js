import { render, screen } from '@testing-library/react';
import App from './App';
import userEvent from "@testing-library/user-event";

const typeIntoForm = ({email, password, confirmPassword}) => {
  const emailInputElement = screen.getByRole("textbox", {
    name: /email/i
  });
  const passwordInputElement = screen.getByLabelText("Password");
  const confirmPasswordInputElement = screen.getByLabelText(/confirm password/i);


  if (email) {
    userEvent.type(emailInputElement, email);
  }
  if (password) {
    userEvent.type(passwordInputElement, password)
  }
  if (confirmPassword) {
    userEvent.type(confirmPasswordInputElement, confirmPassword);
  }
  return {
    emailInputElement,
    passwordInputElement,
    confirmPasswordInputElement
  }
};

const clickOnSubmitBtn = () => {
  userEvent.click(screen.getByRole("button", {
    name: /submit/i
  }));
};

describe('Error handling', () => {
  test('should show email error message on invalid email', () => {
    render(<App />);
    expect(screen.queryByText(/the email you input is invalid/i)).not.toBeInTheDocument();
    typeIntoForm({email:"blablamail.com"});
    clickOnSubmitBtn();
    expect(screen.getByText(/the email you input is invalid/i)).toBeInTheDocument();
  });

  test('should show password error if password is less than 5 characters', () => {
    render(<App />);
    typeIntoForm({email:"blabla@mail.com"});
    expect(screen.queryByText(/the password you entered should contain 5 or more characters/i)).not.toBeInTheDocument();
    typeIntoForm({password:"123"});
    clickOnSubmitBtn();
    expect(screen.getByText(/the password you entered should contain 5 or more characters/i)).toBeInTheDocument();
  });

  test('should show confirm-password error if passwords dont match', () => {
    render(<App />);
    typeIntoForm({email:"blabla@mail.com", password: "12345", confirmPassword: "12347"});
    expect(screen.queryByText(/the passwords don't match. try again/i)).not.toBeInTheDocument();
    clickOnSubmitBtn();
    expect(screen.getByText(/the passwords don't match. try again/i)).toBeInTheDocument();
  });

  test('should show no error message if every input is valid', () => {
    render(<App />);

    typeIntoForm({email:"blabla@mail.com", password:"12345", confirmPassword: "12345"});
    clickOnSubmitBtn();

    expect(screen.queryByText(/the email you input is invalid/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/the password you entered should contain 5 or more characters/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/the passwords don't match. try again/i)).not.toBeInTheDocument();
  });
});

describe('input fields exist and working', () => {
  test('inputs should be initially empty', () => {
    render(<App />);
    expect(screen.getByRole("textbox").value).toBe("");
    expect(screen.getByLabelText("Password").value).toBe("");
    expect(screen.getByLabelText(/confirm password/i).value).toBe("");
  });

  test('should be able to type an email', () => {
    render(<App />);
    const {emailInputElement} = typeIntoForm({email: "bla@bla.com"});
    expect(emailInputElement.value).toBe("bla@bla.com")
  });

  test('should be able to type a password', () => {
    render(<App />);
    const {passwordInputElement} = typeIntoForm({password: "pwd"});
    expect(passwordInputElement.value).toBe("pwd")
  });

  test('should be able to type a confirm-password', () => {
    render(<App />);
    const {confirmPasswordInputElement} = typeIntoForm({confirmPassword: "cpwd"});
    expect(confirmPasswordInputElement.value).toBe("cpwd")
  });
});
