import { render, screen } from '@testing-library/react';
import App from './App';
import userEvent from "@testing-library/user-event";

test('inputs should be initially empty', () => {
  render(<App />);
  const emailInputElement = screen.getByRole("textbox");
  const passwordInputElement = screen.getByLabelText("Password");
  const confirmPasswordInputElement = screen.getByLabelText(/confirm password/i);
  expect(emailInputElement.value).toBe("");
  expect(passwordInputElement.value).toBe("");
  expect(confirmPasswordInputElement.value).toBe("");
});

test('should be able to type an email', () => {
  render(<App />);
  const emailInputElement = screen.getByRole("textbox", {
    name: /email/i
  });
  userEvent.type(emailInputElement, "selena@gmail.com");
  expect(emailInputElement.value).toBe("selena@gmail.com")
});

test('should be able to type a password', () => {
  render(<App />);
  const passwordInputElement = screen.getByLabelText("Password");
  userEvent.type(passwordInputElement, "pwd");
  expect(passwordInputElement.value).toBe("pwd")
});

test('should be able to type a confirm-password', () => {
  render(<App />);
  const confirmPasswordInputElement = screen.getByLabelText(/confirm password/i);
  userEvent.type(confirmPasswordInputElement, "cpwd");
  expect(confirmPasswordInputElement.value).toBe("cpwd")
});

test('should show email error message on invalid email', () => {
  render(<App />);
  const emailErrorelement = screen.queryByText(/the email you input is invalid/i);
  const emailInputElement = screen.getByRole("textbox", {
    name: /email/i
  });
  const submitBtnElement = screen.getByRole("button", {
    name: /submit/i
  });

  expect(emailErrorelement).not.toBeInTheDocument();
  userEvent.type(emailInputElement, "blablamail.com");
  userEvent.click(submitBtnElement);
  const emailErrorelement2 = screen.queryByText(/the email you input is invalid/i);

  expect(emailErrorelement2).toBeInTheDocument();
});

test('should show password error if password is less than 5 characters', () => {
  render(<App />);
  const emailInputElement = screen.getByRole("textbox", {
    name: /email/i
  });
  const passwordErrorelement = screen.queryByText(/the password you entered should contain 5 or more characters/i);
  const passwordInputElement = screen.getByLabelText("Password");
  const submitBtnElement = screen.getByRole("button", {
    name: /submit/i
  });


  userEvent.type(emailInputElement, "blabla@mail.com");
  expect(passwordErrorelement).not.toBeInTheDocument();
  userEvent.type(passwordInputElement, "123");
  userEvent.click(submitBtnElement);
  const passwordErrorelement2 = screen.queryByText(/the password you entered should contain 5 or more characters/i);
  expect(passwordErrorelement2).toBeInTheDocument();
});

test('should show confirm-password error if passwords dont match', () => {
  render(<App />);
  const emailInputElement = screen.getByRole("textbox", {
    name: /email/i
  });
  const confirmPasswordErrorelement = screen.queryByText(/the passwords don't match. try again/i);
  const passwordInputElement = screen.getByLabelText("Password");
  const submitBtnElement = screen.getByRole("button", {
    name: /submit/i
  });
  const confirmPasswordInputElement = screen.getByLabelText(/confirm password/i);


  userEvent.type(emailInputElement, "blabla@mail.com");
  userEvent.type(passwordInputElement, "12345");
  expect(confirmPasswordErrorelement).not.toBeInTheDocument();
  userEvent.type(confirmPasswordInputElement, "12347");
  userEvent.click(submitBtnElement);
  const confirmPasswordErrorelement2 = screen.queryByText(/the passwords don't match. try again/i);
  expect(confirmPasswordErrorelement2).toBeInTheDocument();
});

test('should show no error message if every input is valid', () => {
  render(<App />);
  const emailInputElement = screen.getByRole("textbox", {
    name: /email/i
  });
  const passwordInputElement = screen.getByLabelText("Password");
  const submitBtnElement = screen.getByRole("button", {
    name: /submit/i
  });
  const confirmPasswordInputElement = screen.getByLabelText(/confirm password/i);

  userEvent.type(emailInputElement, "blabla@mail.com");
  userEvent.type(passwordInputElement, "12345");
  userEvent.type(confirmPasswordInputElement, "12345");
  userEvent.click(submitBtnElement);

  const emailErrorelement = screen.queryByText(/the email you input is invalid/i);
  const passwordErrorelement = screen.queryByText(/the password you entered should contain 5 or more characters/i);
  const confirmPasswordErrorelement = screen.queryByText(/the passwords don't match. try again/i);

  expect(emailErrorelement).not.toBeInTheDocument();
  expect(passwordErrorelement).not.toBeInTheDocument();
  expect(confirmPasswordErrorelement).not.toBeInTheDocument();
});
