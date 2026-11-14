import { describe, expect, it } from "vitest";
import {
  isValidEmail,
  isValidPassword,
  validateLogin,
  validateRegister,
} from "@/lib/validation";

describe("isValidEmail", () => {
  it.each(["a@b.co", "student.name+tag@uni.edu.in"])("accepts %s", (e) => {
    expect(isValidEmail(e)).toBe(true);
  });
  it.each(["", "plain", "no-at.com", "a@b", "a b@c.com"])("rejects %s", (e) => {
    expect(isValidEmail(e)).toBe(false);
  });
});

describe("isValidPassword", () => {
  it("requires 8+ characters with a letter and a digit", () => {
    expect(isValidPassword("abcdefg1")).toBe(true);
    expect(isValidPassword("abc1")).toBe(false);
    expect(isValidPassword("abcdefgh")).toBe(false);
    expect(isValidPassword("12345678")).toBe(false);
  });
});

describe("validateRegister", () => {
  const good = {
    name: "Asha Rao",
    email: "asha@example.com",
    password: "secret123",
    confirmPassword: "secret123",
  };

  it("returns no errors for valid input", () => {
    expect(validateRegister(good)).toEqual({});
  });

  it("flags every invalid field", () => {
    const errors = validateRegister({
      name: "A",
      email: "x",
      password: "short",
      confirmPassword: "other",
    });
    expect(Object.keys(errors).sort()).toEqual([
      "confirmPassword",
      "email",
      "name",
      "password",
    ]);
  });

  it("flags mismatched confirmation", () => {
    expect(
      validateRegister({ ...good, confirmPassword: "different1" })
        .confirmPassword,
    ).toBe("Passwords do not match.");
  });
});

describe("validateLogin", () => {
  it("requires a valid email and a password", () => {
    expect(validateLogin("bad", "")).toEqual({
      email: "Please enter a valid email address.",
      password: "Please enter your password.",
    });
    expect(validateLogin("ok@ok.com", "x")).toEqual({});
  });
});
