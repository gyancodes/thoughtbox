import { describe, it, expect } from "vitest";
import {
  AppwriteServiceError,
  NetworkError,
  AuthenticationError,
  ValidationError,
} from "../appwrite.js";

describe("AppwriteService Unit Tests", () => {
  describe("Error Classes", () => {
    it("should create AppwriteServiceError with correct properties", () => {
      const originalError = new Error("Original error");
      const error = new AppwriteServiceError(
        "Test message",
        "TEST_CODE",
        originalError
      );

      expect(error.message).toBe("Test message");
      expect(error.code).toBe("TEST_CODE");
      expect(error.name).toBe("AppwriteServiceError");
      expect(error.originalError).toBe(originalError);
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AppwriteServiceError);
    });

    it("should create NetworkError with correct inheritance", () => {
      const originalError = new Error("Network issue");
      const error = new NetworkError("Network failed", originalError);

      expect(error.message).toBe("Network failed");
      expect(error.code).toBe("NETWORK_ERROR");
      expect(error.name).toBe("NetworkError");
      expect(error.originalError).toBe(originalError);
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AppwriteServiceError);
      expect(error).toBeInstanceOf(NetworkError);
    });

    it("should create AuthenticationError with correct inheritance", () => {
      const originalError = new Error("Auth issue");
      const error = new AuthenticationError("Auth failed", originalError);

      expect(error.message).toBe("Auth failed");
      expect(error.code).toBe("AUTH_ERROR");
      expect(error.name).toBe("AuthenticationError");
      expect(error.originalError).toBe(originalError);
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AppwriteServiceError);
      expect(error).toBeInstanceOf(AuthenticationError);
    });

    it("should create ValidationError with correct inheritance", () => {
      const originalError = new Error("Validation issue");
      const error = new ValidationError("Validation failed", originalError);

      expect(error.message).toBe("Validation failed");
      expect(error.code).toBe("VALIDATION_ERROR");
      expect(error.name).toBe("ValidationError");
      expect(error.originalError).toBe(originalError);
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AppwriteServiceError);
      expect(error).toBeInstanceOf(ValidationError);
    });
  });

  describe("Error Handling Logic", () => {
    it("should properly chain error types", () => {
      const rootError = new Error("Root cause");
      const networkError = new NetworkError("Network layer failed", rootError);
      const authError = new AuthenticationError(
        "Auth layer failed",
        networkError
      );

      expect(authError.originalError).toBe(networkError);
      expect(authError.originalError.originalError).toBe(rootError);
      expect(authError.originalError.originalError.message).toBe("Root cause");
    });

    it("should maintain error stack traces", () => {
      const originalError = new Error("Original");
      const wrappedError = new NetworkError("Wrapped", originalError);

      expect(wrappedError.stack).toBeDefined();
      expect(typeof wrappedError.stack).toBe("string");
    });
  });

  describe("Error Code Constants", () => {
    it("should have consistent error codes", () => {
      const networkError = new NetworkError("test");
      const authError = new AuthenticationError("test");
      const validationError = new ValidationError("test");

      expect(networkError.code).toBe("NETWORK_ERROR");
      expect(authError.code).toBe("AUTH_ERROR");
      expect(validationError.code).toBe("VALIDATION_ERROR");
    });
  });
});
